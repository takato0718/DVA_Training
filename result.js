// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() { // 画面がロードされた時に自動で実行される
    // URLパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    // URLSearchParamsはURLのクエリパラメータ(URLの?以降の部分)を簡単に扱えるweb API
    // window.location.search は現在のURLのクエリ部分(?以降)を取得する
    // URLのクエリ部分に正解数などのデータがあるのでそれを抽出する
    const correctCount = parseInt(urlParams.get('correct')) || 0;
    // parseIntで正解数などの文字列を数値に変換する
    // || 0 (論理OR演算子)でデフォルトの正解数０を設定
    const totalCount = parseInt(urlParams.get('total')) || 10;
    
    // 結果を表示
    displayResults(correctCount, totalCount);
    
    // ボタンのイベントリスナーを設定
    setupEventListeners(correctCount, totalCount);
});

 // 結果を画面に表示する関数
function displayResults(correctCount, totalCount) {
    // 正解数表示
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = correctCount;
    }

    // 総問題数表示
    const totalElement = document.getElementById('total');
    if (totalElement) { // scoreが存在するかの確認
        totalElement.textContent = `/ ${totalCount}問`;
    }
    
    // 詳細情報の表示
    const totalQuestionsElement = document.getElementById('total-questions');
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = `${totalCount}問`;
    }
    
    const correctCountElement = document.getElementById('correct-count');
    if (correctCountElement) {
        correctCountElement.textContent = `${correctCount}問`;
    }
    
    const incorrectCountElement = document.getElementById('incorrect-count');
    if (incorrectCountElement) {
        incorrectCountElement.textContent = `${totalCount - correctCount}問`;
    }
    
    // メッセージ表示
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = getResultMessage(correctCount, totalCount);
    }
}

 // 正解数に応じたメッセージを返す関数
function getResultMessage(correctCount, totalCount) {
    const accuracy = (correctCount / totalCount) * 100;
    
    if (accuracy === 100) {
        return 'どうわぁ！完璧だ！！';
    } else if (accuracy >= 80) {
        return 'なかなかやるじゃん？';
    } else if (accuracy >= 60) {
        return 'もうちょいって感じかも〜';
    } else if (accuracy >= 40) {
        return 'まだまだだね😏';
    } else {
        return 'え！？・・・目、大丈夫？？👀';
    }
}

 // ボタンのイベントリスナーを設定する関数
function setupEventListeners(correctCount, totalCount) {
    // Twitterシェアボタン
    const twitterBtn = document.getElementById('twitter-share-button');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function() {
            shareOnTwitter(correctCount, totalCount);
        });
    }
}

 // Twitterでシェアする関数
function shareOnTwitter(correctCount, totalCount) {

    const message = getResultMessage(correctCount, totalCount);

    const text = `動体視力トレーニングで${totalCount}問中${correctCount}問正解しました!\n${message}\nあなたも挑戦してみよう!`;
    const url = window.location.origin; // 現在のページのURL
    const hashtags = 'DVAトレーニング';
    
    // Twitter Web Intent URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
    
    // 新しいウィンドウでTwitterを開く
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}
