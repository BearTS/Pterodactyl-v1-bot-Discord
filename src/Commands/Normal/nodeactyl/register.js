const User = require('../../../Model/User');

module.exports = {
    name: 'register',
    aliases: [],
    description: 'Get all servers',
    ownerOnly: false,
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    category: 'Nodeactyl',
    usage: '',
    run: async (client, message, args, Discord) => {
        try {
            User.findById(message.author.id, (err, doc) => {
                if (err) return console.log(err);
                if (doc) {
                    return message.reply(`You are already registered!\nif you want to reregister, please use \`${process.env.PREFIX}unregister\` command`);
                }
                if (!doc) {
                    message.reply('Check your dm\'s to register with the panel!');
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Please Enter the API KEY below')
                        .setColor('Blue')
                        .setFooter({ text: `Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                   
                    message.author.send({ embeds: [embed] }).then(async (msg) => {
                        const filter = m => m.author.id === message.author.id;
                        const collector = msg.channel.createMessageCollector(filter, { time: 60000 });
                        
                        collector.on('collect', async (m) => {
                            if (m.content.toLowerCase() === 'cancel') {
                                collector.stop();
                                return msg.channel.send('Cancelled!');
                            }
                            if (m.content) {
                                const user = new User({
                                    _id: message.author.id,
                                    data: {
                                        clientToken: m.content
                                    }
                                });
                                user.save();
                                collector.stop();
                                return msg.channel.send('Successfully Registered!');
                            }
                        });
                        
                        collector.on('end', async (collected, reason) => {
                            console.log(`Collected ${collected.size} items.`);
                            if (reason === 'time') {
                                return msg.channel.send('Timed out!');
                            }
   
                        });
                    });
                }
            });
        } catch (err) {
            return message.reply({ content: `Let my developer know in the support server https://discord.gg/dDnmY56 or using \`${process.env.PREFIX}feedback\` command`, embeds: [ 
                new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription(`\`${err}\``)
                    .setFooter({ text: `Error Occured | Made by Bear#3437 | ©️ ${new Date().getFullYear()} Tamako`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })]
            });
        }
    }

};

/**
 * @INFO
 * Bot Coded by Bear#3437 | https://github.com/bearts
 * @INFO
 * Tamako Tech | https://tamako.tech/
 * @INFO
 */