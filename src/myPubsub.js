const myPubsub = (() => {
    const subcribers = {};

    function publish(eventName, data) {
        if (!subcribers[eventName])
            return;

        // Execute fn with the data as an arg
        subcribers[eventName].forEach(subcriberCallback => {
            subcriberCallback(data);
        });
    }

    const subcribe = (eventName, callback) => {
        
        if (!subcribers[eventName]) {
            subcribers[eventName] = [];
        }
        
        subcribers[eventName].push(callback);

        
    };

    const unsubcribe = (eventName, callback) => {
        if (!subcribers[eventName]) return;

        for (let i = 0; i < subcribers[eventName].length; i++) {
            if (callback === subcribers[eventName][i]) {
                subcribers[eventName][i].splice(i, 1);
            }
        }
    };

    return {subcribers, publish, subcribe, unsubcribe};
})()
;


export default myPubsub