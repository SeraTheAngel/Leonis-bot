// 8ball command implementation

module.exports = { 
    name: '8ball',
    description: 'Ask the magic 8ball a question!',
    execute(message, args) {
        const responses = [
            'Yes',
            'No',
            'Maybe',
            'Definitely',
            'I don’t think so',
            'Absolutely',
            'Not a chance',
            'Ask again later'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        message.channel.send(response);
    }
};
