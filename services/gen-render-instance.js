const generateRenderInstance = function ({ audioCollection, avatarCollection }) {
    return audioCollection.map((audioBuffer, index) => ({
        id: `_${Math.random().toString(36).substr(2, 9)}`,
        audioBuffer,
        avatarBuffer: avatarCollection[index],
    }))
};

module.exports = { generateRenderInstance };
