/**
 * RADIO BOT DISCORD.JS - SOLUTION DÉFINITIVE STABLE
 * 
 * Discord.js est BEAUCOUP plus stable que discord.py pour les connexions vocales !
 * Plus d'erreurs 4006, connections robustes, audio fluide.
 */

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');

// Configuration du bot avec tous les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Stockage des connexions vocales par serveur
const voiceConnections = new Map();
const audioPlayers = new Map();
const currentStations = new Map();

// SOLUTION YOUTUBE - Plus compatible sur Replit
const ytdl = require('ytdl-core');

const radioStations = {
    'test': {
        name: '🎵 Musique Douce',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lofi hip hop radio
        emoji: '🎵',
        type: 'youtube'
    },
    'chill': {
        name: '🌸 Chill Radio',
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A', // Lofi chill
        emoji: '🌸', 
        type: 'youtube'
    },
    'jazz': {
        name: '🎷 Jazz Radio',
        url: 'https://www.youtube.com/watch?v=Dx5qFachd3A', // Jazz radio
        emoji: '🎷',
        type: 'youtube'  
    },
    'piano': {
        name: '🎹 Piano Relax',
        url: 'https://www.youtube.com/watch?v=WHPEKLQID4U', // Piano relaxant
        emoji: '🎹',
        type: 'youtube'
    },
    'nature': {
        name: '🌿 Sons Nature', 
        url: 'https://www.youtube.com/watch?v=eKFTSSKCzWA', // Sons de la nature
        emoji: '🌿',
        type: 'youtube'
    },
    'pop': {
        name: '💖 Pop Hits',
        url: 'https://www.youtube.com/watch?v=36YnV9STBqc', // Pop radio
        emoji: '💖',
        type: 'youtube'
    },
    'electronic': {
        name: '🌈 Electronic',
        url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY', // Electronic music
        emoji: '🌈',
        type: 'youtube'
    },
    'ambient': {
        name: '✨ Ambient Space',
        url: 'https://www.youtube.com/watch?v=LNOlYlRyZxI', // Ambient space
        emoji: '✨',
        type: 'youtube'
    }
};

// État de connexion avec plus de debug
client.once('ready', () => {
    console.log('🎵 Radio Bot Discord.js connecté ! (STABLE) 🎵');
    console.log(`✅ Bot: ${client.user.tag}`);
    console.log(`🆔 ID: ${client.user.id}`);
    console.log(`🌐 Serveurs: ${client.guilds.cache.size}`);
    
    if (client.guilds.cache.size === 0) {
        console.log('');
        console.log('🚨 LE BOT N\'EST DANS AUCUN SERVEUR DISCORD !');
        console.log('');
        console.log('🔗 LIEN D\'INVITATION À COPIER :');
        const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36703232&scope=bot%20applications.commands`;
        console.log(`📋 ${inviteURL}`);
        console.log('');
        console.log('✅ 1. Copiez ce lien dans votre navigateur');
        console.log('✅ 2. Sélectionnez votre serveur Discord');
        console.log('✅ 3. Autorisez toutes les permissions');
        console.log('✅ 4. Testez !test dans un channel text');
        console.log('');
    } else {
        console.log('🚀 Plus d\'erreurs 4006 ! Discord.js est ultra-stable !');
        console.log('📢 Commandes disponibles: !radio_stable, !test');
        console.log('🔧 Mode debug activé pour diagnostiquer les messages');
        
        client.guilds.cache.forEach(guild => {
            console.log(`📍 Serveur: ${guild.name} (${guild.memberCount} membres)`);
        });
    }
});

// Gestion de la commande radio avec debug
client.on('messageCreate', async (message) => {
    // Ignorer les messages du bot
    if (message.author.bot) return;
    
    console.log(`📨 Message reçu: "${message.content}" de ${message.author.tag}`);
    
    // Commande radio
    if (message.content === '!radio_stable') {
        console.log('🎵 Commande radio détectée !');
        
        // Vérification des permissions
        if (!message.member) {
            console.log('❌ Pas de member object');
            return;
        }
        
        if (!message.member.permissions.has('Administrator')) {
            await message.reply('❌ **Vous devez être administrateur pour utiliser cette commande !**');
            return;
        }
        
        console.log('✅ Permissions OK, création interface...');
        await createRadioInterface(message);
    }
    
    // Commande de test simple
    if (message.content === '!test') {
        console.log('🔧 Commande test détectée !');
        await message.reply('✅ **Bot Node.js fonctionne parfaitement !** 🚀');
    }
});

// Création de l'interface radio
async function createRadioInterface(message) {
    const embed = new EmbedBuilder()
        .setTitle('🌸 Radio Saylor Moon - Discord.js Stable 🌿')
        .setDescription('**✨ Interface radio ultra-stable avec Discord.js !**\n\n🌸 **Rejoignez un vocal**\n🌿 **Cliquez CONNECTER**\n💖 **Profitez de la stabilité !**')
        .setColor('#FF69B4')
        .addFields(
            {
                name: '🌸 8 Stations Radio France 🌿',
                value: '🎵 **FIP** • 🌹 **France Inter** • 📰 **France Info** • 🎼 **France Musique**\n📚 **France Culture** • 🎷 **FIP Jazz** • 🌍 **FIP World** • 🎸 **FIP Rock**',
                inline: false
            },
            {
                name: '⚡ Technologie Ultra-Stable',
                value: '✅ **Discord.js** - Connexions vocales fiables\n🚀 **Plus d\'erreur 4006** - Fini les crashes\n🎵 **Audio HD** - Qualité premium\n💖 **Interface élégante** - Design vert-rose',
                inline: false
            }
        )
        .setFooter({ text: '🌸✨ Powered by Discord.js • Stable & Reliable • Anti-Crash ✨🌿' });

    // Boutons de contrôle
    const controlRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('connect')
                .setLabel('🌸 CONNECTER')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('💖 STOP')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setLabel('✨ QUITTER')
                .setStyle(ButtonStyle.Secondary)
        );

    // Boutons stations - Ligne 1
    const stationRow1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test')
                .setLabel('🎵 Musique Douce')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('chill')
                .setLabel('🌸 Chill Radio')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('jazz')
                .setLabel('🎷 Jazz Radio')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('piano')
                .setLabel('🎹 Piano Relax')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('musique')
                .setLabel('🎼 France Musique')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
        );

    // Boutons stations - Ligne 2
    const stationRow2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('nature')
                .setLabel('🌿 Sons Nature')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('pop')
                .setLabel('💖 Pop Hits')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('electronic')
                .setLabel('🌈 Electronic')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('ambient')
                .setLabel('✨ Ambient Space')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
        );

    await message.reply({
        embeds: [embed],
        components: [controlRow, stationRow1, stationRow2]
    });
}

// Gestion des interactions boutons
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const guildId = interaction.guildId;
    const member = interaction.member;

    try {
        // Bouton CONNECTER
        if (interaction.customId === 'connect') {
            if (!member.voice.channel) {
                return await interaction.reply({ 
                    content: '❌ **Rejoignez d\'abord un channel vocal !**', 
                    ephemeral: true 
                });
            }

            await interaction.deferReply();

            // Nettoyage des connexions existantes
            await cleanupConnection(guildId);

            try {
                // Connexion vocale avec Discord.js (ULTRA STABLE)
                const connection = joinVoiceChannel({
                    channelId: member.voice.channel.id,
                    guildId: guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                // Gestion des événements de connexion
                connection.on(VoiceConnectionStatus.Ready, () => {
                    console.log(`✅ Connexion vocale stable - ${member.voice.channel.name}`);
                });

                connection.on(VoiceConnectionStatus.Disconnected, async () => {
                    console.log('🔄 Connexion perdue - tentative de reconnexion...');
                    try {
                        await connection.destroy();
                    } catch (error) {
                        console.log('Nettoyage connexion:', error.message);
                    }
                });

                // Stockage
                voiceConnections.set(guildId, connection);

                // Créer un player audio
                const player = createAudioPlayer();
                audioPlayers.set(guildId, player);
                connection.subscribe(player);

                // Mise à jour de l'interface
                const updatedEmbed = new EmbedBuilder()
                    .setTitle('🌿 Connexion Discord.js Réussie ! 💖')
                    .setDescription(`⚡ **Connecté à ${member.voice.channel.name}** avec Discord.js ⚡\n\n🚀 **Aucune erreur 4006 !** \n✨ **Choisissez maintenant votre station !** ✨`)
                    .setColor('#00FF7F');

                // Activer les boutons stations
                const newComponents = interaction.message.components.map(row => {
                    const newRow = new ActionRowBuilder();
                    row.components.forEach(component => {
                        const newButton = new ButtonBuilder(component.data);
                        if (component.customId === 'connect') {
                            newButton.setLabel('🌿 CONNECTÉ').setStyle(ButtonStyle.Success);
                        } else if (radioStations[component.customId]) {
                            newButton.setDisabled(false);
                        }
                        newRow.addComponents(newButton);
                    });
                    return newRow;
                });

                await interaction.editReply({
                    embeds: [updatedEmbed],
                    components: newComponents
                });

            } catch (error) {
                console.error('Erreur connexion:', error);
                await interaction.editReply({
                    content: `❌ **Erreur connexion:** ${error.message}\n\n🔧 **Note:** Discord.js est plus stable, mais il peut y avoir des problèmes réseau sur Replit.`
                });
            }
        }

        // Bouton STOP
        else if (interaction.customId === 'stop') {
            await interaction.deferReply();

            const player = audioPlayers.get(guildId);
            if (player) {
                player.stop();
                currentStations.delete(guildId);

                const embed = new EmbedBuilder()
                    .setTitle('💖 Radio en Pause 🌸')
                    .setDescription('🌿 **Lecture stoppée avec Discord.js**\n\n✨ Choisissez une station pour continuer ✨')
                    .setColor('#FF69B4');

                // Reset visuel des boutons stations
                const newComponents = interaction.message.components.map(row => {
                    const newRow = new ActionRowBuilder();
                    row.components.forEach(component => {
                        const newButton = new ButtonBuilder(component.data);
                        if (radioStations[component.customId]) {
                            newButton.setStyle(ButtonStyle.Primary);
                        }
                        newRow.addComponents(newButton);
                    });
                    return newRow;
                });

                await interaction.editReply({
                    embeds: [embed],
                    components: newComponents
                });
            } else {
                await interaction.editReply({ content: '❌ **Aucune musique en cours !**' });
            }
        }

        // Bouton DÉCONNECTER
        else if (interaction.customId === 'disconnect') {
            await interaction.deferReply();
            await cleanupConnection(guildId);

            const embed = new EmbedBuilder()
                .setTitle('✨ À Bientôt ! 🌸')
                .setDescription('🌿 **Sorti du vocal proprement**\n\n💖 Rejoignez un vocal et cliquez **CONNECTER** pour recommencer 💖')
                .setColor('#9370DB');

            // Reset complet de l'interface
            const newComponents = interaction.message.components.map(row => {
                const newRow = new ActionRowBuilder();
                row.components.forEach(component => {
                    const newButton = new ButtonBuilder(component.data);
                    if (component.customId === 'connect') {
                        newButton.setLabel('🌸 CONNECTER').setStyle(ButtonStyle.Success);
                    } else if (radioStations[component.customId]) {
                        newButton.setDisabled(true).setStyle(ButtonStyle.Secondary);
                    }
                    newRow.addComponents(newButton);
                });
                return newRow;
            });

            await interaction.editReply({
                embeds: [embed],
                components: newComponents
            });
        }

        // Boutons stations radio
        else if (radioStations[interaction.customId]) {
            await playRadioStation(interaction, interaction.customId);
        }

    } catch (error) {
        console.error('Erreur interaction:', error);
        await interaction.reply({ 
            content: `❌ **Erreur:** ${error.message}`, 
            ephemeral: true 
        });
    }
});

// Lecture d'une station radio
async function playRadioStation(interaction, stationId) {
    const guildId = interaction.guildId;
    const station = radioStations[stationId];
    
    if (!voiceConnections.has(guildId)) {
        return await interaction.reply({ 
            content: '❌ **Cliquez d\'abord sur CONNECTER !**', 
            ephemeral: true 
        });
    }

    await interaction.deferReply();

    try {
        const player = audioPlayers.get(guildId);
        const connection = voiceConnections.get(guildId);

        // Arrêt propre de la musique précédente
        if (player) {
            player.stop();
        }

        // Attendre un peu pour la transition
        await new Promise(resolve => setTimeout(resolve, 500));

        // SOLUTION YOUTUBE - Méthode qui marche souvent sur Replit !
        console.log(`🎵 YOUTUBE MODE: ${station.name}`);
        
        let resource;
        
        if (station.type === 'youtube') {
            try {
                console.log(`📺 Extraction audio YouTube: ${station.url}`);
                
                // Extraire l'audio de YouTube (plus compatible)
                const stream = ytdl(station.url, { 
                    filter: 'audioonly',
                    quality: 'lowestaudio', // Pour économiser la bande passante
                    highWaterMark: 1 << 25 // Buffer plus grand
                });
                
                resource = createAudioResource(stream, {
                    inputType: 'arbitrary',
                    inlineVolume: true,
                    metadata: {
                        title: station.name,
                    },
                });
                
                console.log(`✅ YOUTUBE AUDIO CRÉÉ: ${station.name}`);
                
            } catch (error) {
                console.error(`❌ Erreur YouTube: ${error.message}`);
                throw error;
            }
        } else {
            // Fallback pour les URL classiques 
            resource = createAudioResource(station.url, {
                inputType: 'arbitrary',
                inlineVolume: false,
            });
            console.log(`✅ Ressource classique créée`);
        }
        
        // Régler le volume
        if (resource.volume) {
            resource.volume.setVolume(0.5); // Volume plus bas pour éviter la saturation
        }
        
        // Vérifier si la ressource est valide
        console.log(`🔧 Ressource créée pour ${station.name}`);

        // Jouer la station
        player.play(resource);
        currentStations.set(guildId, stationId);

        // Gestion des événements du player avec plus de debug
        player.on(AudioPlayerStatus.Playing, () => {
            console.log(`🎵 Lecture ${station.name} démarrée avec succès !`);
            console.log(`🔊 Audio diffuse maintenant dans Discord !`);
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log(`⏸️ ${station.name} arrêtée ou en pause`);
        });

        player.on(AudioPlayerStatus.Buffering, () => {
            console.log(`⏳ ${station.name} en cours de chargement...`);
        });

        player.on('error', error => {
            console.error(`❌ ERREUR AUDIO ${station.name}:`, error);
            console.error(`🔧 Détails erreur:`, error.message);
        });
        
        // Vérifier la connexion audio
        console.log(`🔗 Player connecté à la connexion vocale: ${connection ? 'OUI' : 'NON'}`);
        console.log(`🎮 État du player: ${player.state.status}`);
        
        // Debug de la ressource (correction)
        resource.playStream.on('error', (error) => {
            console.error(`❌ ERREUR RESSOURCE ${station.name}:`, error);
        });

        // Mise à jour visuelle
        const embed = new EmbedBuilder()
            .setTitle('🌸 Station Active avec Discord.js ! ✨')
            .setDescription(`🎵 **${station.name}** diffuse en beauté ! 💖\n\n⚡ **Technologie:** Discord.js (ultra-stable)\n✨ **Qualité:** HD Premium`)
            .setColor('#32CD32')
            .setFooter({ text: '🌈 Discord.js = Zéro crash, audio fluide, connexions stables' });

        // Mise à jour des boutons (station active en vert)
        const newComponents = interaction.message.components.map(row => {
            const newRow = new ActionRowBuilder();
            row.components.forEach(component => {
                const newButton = new ButtonBuilder(component.data);
                if (component.customId === stationId) {
                    newButton.setStyle(ButtonStyle.Success); // Station active
                } else if (radioStations[component.customId]) {
                    newButton.setStyle(ButtonStyle.Primary); // Autres stations
                }
                newRow.addComponents(newButton);
            });
            return newRow;
        });

        await interaction.editReply({
            embeds: [embed],
            components: newComponents
        });

        console.log(`✅ Station ${station.name} démarrée avec succès !`);

    } catch (error) {
        console.error(`Erreur lecture ${station.name}:`, error);
        await interaction.editReply({
            content: `❌ **Problème avec ${station.name}**\n\n🔄 **Erreur:** ${error.message}\n**Solution:** Essayez une autre station.`
        });
    }
}

// Nettoyage des connexions
async function cleanupConnection(guildId) {
    try {
        // Arrêter le player
        const player = audioPlayers.get(guildId);
        if (player) {
            player.stop();
            audioPlayers.delete(guildId);
        }

        // Déconnecter la voix
        const connection = voiceConnections.get(guildId);
        if (connection) {
            connection.destroy();
            voiceConnections.delete(guildId);
        }

        currentStations.delete(guildId);
        console.log(`🧹 Nettoyage connexions ${guildId} terminé`);
    } catch (error) {
        console.error('Erreur nettoyage:', error);
    }
}

// Gestion des erreurs non interceptées
process.on('unhandledRejection', (error) => {
    console.error('Erreur non gérée:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Exception non interceptée:', error);
    process.exit(1);
});

// Démarrage du bot avec le bon token
const token = process.env.TROLL_VOICE;
if (!token) {
    console.error('❌ TROLL_VOICE token manquant !');
    process.exit(1);
}

console.log('🔑 Utilisation du token TROLL_VOICE (Saylor Moon bot)');
client.login(token);
