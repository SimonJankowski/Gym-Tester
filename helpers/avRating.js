const avRating = function (arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum = sum + arr[i].rating;
    }
    let realScore = sum / arr.length;
    let roundedScore = Math.round(realScore);
    scores = [realScore, roundedScore]
    return scores
}

module.exports = avRating