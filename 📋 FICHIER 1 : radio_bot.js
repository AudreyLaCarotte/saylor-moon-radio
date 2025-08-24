/**
 * RADIO BOT DISCORD.JS - VERSION RENDER COMPATIBLE
 * Simplifié pour éviter les modules natifs problématiques
 */

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');

// Configuration du bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Stockage des connexions vocales
const voiceConnections = new Map();
const audioPlayers = new Map();
const currentStations = new Map();

// STATIONS RADIO DIRECTES (streams HTTP)
const radioStations = {
    'france_inter': {
        name: '📻 France Inter',
        url: 'https://icecast.radiofrance.fr/franceinter-hifi.aac',
        emoji: '📻',
        type: 'direct'
    },
    'france_info': {
        name: '📺 France Info',
        url: 'https://icecast.radiofrance.fr/franceinfo-hifi.aac',
        emoji: '📺',
        type: 'direct'
    },
    'france_culture': {
        name: '🎭 France Culture',
        url: 'https://icecast.radiofrance.fr/franceculture-hifi.aac',
        emoji: '🎭',
        type: 'direct'
    },
    'france_musique': {
        name: '🎼 France Musique',
        url: 'https://icecast.radiofrance.fr/francemusique-hifi.aac',
        emoji: '🎼',
        type: 'direct'
    },
    'fip': {
        name: '🎵 FIP',
        url: 'https://icecast.radiofrance.fr/fip-hifi.aac',
        emoji: '🎵',
        type: 'direct'
    },
    'mouv': {
        name: '🎸 Mouv',
        url: 'https://icecast.radiofrance.fr/mouv-hifi.aac',
        emoji: '🎸',
        type: 'direct'
    },
    'france_bleu': {
        name: '💙 France Bleu',
        url: 'https://icecast.radiofrance.fr/francebleu001-hifi.aac',
        emoji: '💙',
        type: 'direct'
    },
    'rfi': {
        name: '🌍 RFI Monde',
        url: 'https://rfifrench64k.ice.infomaniak.ch/rfifrench-64.mp3',
        emoji: '🌍',
        type: 'direct'
    }
};

// Fonction pour créer l'interface radio
function createRadioEmbed() {
    const embed = new EmbedBuilder()
        .setTitle('🌸 Saylor Moon Radio 🌸')
        .setDescription('**Choisissez votre station Radio France préférée !**\n\n🎵 *Interface ultra-économique avec streaming direct* 🎵')
        .setColor([255, 105, 180]) // Rose
        .addFields([
            {
                name: '📻 Stations Disponibles',
                value: Object.values(radioStations).map(station => 
                    `${station.emoji} **${station.name}**`
                ).join('\n'),
                inline: false
            },
            {
                name: '💖 Instructions',
                value: '1️⃣ Rejoignez un salon vocal\n2️⃣ Cliquez sur une station\n3️⃣ Profitez de la musique !',
                inline: false
            }
        ])
        .setFooter({ text: '💚 Saylor Moon Bot • Ultra Economic Version 💚' })
        .setTimestamp();

    return embed;
}

// Fonction pour créer les boutons
function createRadioButtons() {
    const rows = [];
    const stations = Object.entries(radioStations);
    
    // Créer des rangées de 4 boutons
    for (let i = 0; i < stations.length; i += 4) {
        const row = new ActionRowBuilder();
        const rowStations = stations.slice(i, i + 4);
        
        rowStations.forEach(([key, station]) => {
            const button = new ButtonBuilder()
                .setCustomId(`radio_${key}`)
                .setLabel(station.name)
                .setEmoji(station.emoji)
                .setStyle(ButtonStyle.Primary);
            row.addComponents(button);
        });
        
        rows.push(row);
    }
    
    // Bouton stop
    const stopRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('radio_stop')
                .setLabel('⏹️ Arrêter la Radio')
                .setStyle(ButtonStyle.Danger)
        );
    
    rows.push(stopRow);
    return rows;
}

// Fonction pour jouer une station
async function playStation(interaction, stationKey) {
    try {
        const station = radioStations[stationKey];
        if (!station) {
            return interaction.reply({ content: '❌ Station introuvable !', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member?.voice?.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Vous devez être dans un salon vocal !', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        // Rejoindre le salon vocal
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        // Créer un lecteur audio
        const player = createAudioPlayer();
        
        // Créer la ressource audio
        const resource = createAudioResource(station.url, {
            inlineVolume: true
        });
        
        resource.volume?.setVolume(0.5);

        // Connecter le lecteur
        connection.subscribe(player);
        player.play(resource);

        // Stocker les connexions
        voiceConnections.set(interaction.guild.id, connection);
        audioPlayers.set(interaction.guild.id, player);
        currentStations.set(interaction.guild.id, station);

        // Gérer les événements
        player.on(AudioPlayerStatus.Playing, () => {
            console.log(`🎵 Lecture: ${station.name}`);
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('🔄 Redémarrage du stream...');
            // Redémarrer automatiquement
            setTimeout(() => {
                const newResource = createAudioResource(station.url, {
                    inlineVolume: true
                });
                newResource.volume?.setVolume(0.5);
                player.play(newResource);
            }, 1000);
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('✅ Connexion vocale prête !');
        });

        // Réponse de confirmation
        const successEmbed = new EmbedBuilder()
            .setTitle('🎵 Radio Démarrée !')
            .setDescription(`**${station.emoji} ${station.name}** joue maintenant dans **${voiceChannel.name}**`)
            .setColor([50, 205, 50])
            .setTimestamp();

        await interaction.editReply({ embeds: [successEmbed] });

    } catch (error) {
        console.error('❌ Erreur lecture:', error);
        await interaction.editReply({ 
            content: '❌ Erreur lors du démarrage de la radio !', 
            ephemeral: true 
        });
    }
}

// Fonction pour arrêter la radio
async function stopRadio(interaction) {
    try {
        const guildId = interaction.guild.id;
        
        const connection = voiceConnections.get(guildId);
        const player = audioPlayers.get(guildId);
        
        if (player) {
            player.stop();
            audioPlayers.delete(guildId);
        }
        
        if (connection) {
            connection.destroy();
            voiceConnections.delete(guildId);
        }
        
        currentStations.delete(guildId);

        const stopEmbed = new EmbedBuilder()
            .setTitle('⏹️ Radio Arrêtée')
            .setDescription('La radio a été arrêtée avec succès !')
            .setColor([255, 69, 0])
            .setTimestamp();

        await interaction.reply({ embeds: [stopEmbed] });

    } catch (error) {
        console.error('❌ Erreur stop:', error);
        await interaction.reply({ 
            content: '❌ Erreur lors de l\'arrêt de la radio !', 
            ephemeral: true 
        });
    }
}

// Événement ready
client.once('ready', () => {
    console.log('🌸✨ SAYLOR MOON RADIO BOT CONNECTÉ ! ✨🌸');
    console.log(`Bot: ${client.user.tag}`);
    console.log(`Serveurs: ${client.guilds.cache.size}`);
    console.log('💖 Version Render Compatible 💖');
    
    client.user.setActivity('🎵 Radio France | !radio', { type: 'LISTENING' });
});

// Commande radio
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content.toLowerCase() === '!radio') {
        const embed = createRadioEmbed();
        const buttons = createRadioButtons();
        
        await message.reply({ 
            embeds: [embed], 
            components: buttons 
        });
    }
    
    if (message.content.toLowerCase() === '!test') {
        await message.reply('🌸 **Saylor Moon Radio Bot est en ligne !** 🌸\n\nTapez `!radio` pour ouvrir l\'interface radio ! 🎵');
    }
});

// Gestion des interactions boutons
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId.startsWith('radio_')) {
        const stationKey = interaction.customId.replace('radio_', '');
        
        if (stationKey === 'stop') {
            await stopRadio(interaction);
        } else {
            await playStation(interaction, stationKey);
        }
    }
});

// Gestion des erreurs
client.on('error', error => {
    console.error('❌ Erreur Discord:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ Erreur non gérée:', error);
});

// Connexion du bot
const token = process.env.TROLL_VOICE;
if (!token) {
    console.error('❌ Token Discord manquant ! Ajoutez TROLL_VOICE dans les variables d\'environnement.');
    process.exit(1);
}

client.login(token).catch(error => {
    console.error('❌ Erreur de connexion:', error);
    process.exit(1);
});
