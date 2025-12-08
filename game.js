const TOTAL_ROUNDS = 10; // 問題数
const COUNTDOWN_TIME = 3; // カウントダウン
const MOVE_DURATION = 100; // 文字の移動時間(ミリ秒) - 難しい設定
const DURATION_PER_CHAR = 40;   // 1文字あたりの追加時間

// ゲームの状態
let currentRound = 1;
let correctCount = 0;
let targetText = '';
let gameTextList = [];

// 出題する文字列リスト
const TEXT_LIST = [
    '何をするだァーッ',
    'おまえは今まで食ったパンの枚数を覚えているのか？',
    'メメタァ',
    '逃げるんだよォ！',
    '飲んどる場合かーッ',
    '歩道が広いではないか、行け',
    'もしかしてオラオラですか？',
    '嘘をついてる味',
    '故郷に帰ったら学校行くよ',
    'お茶でも飲んで話でもしようや',
    '俺はアポロ11号なんだ',
    '素数を数えて落ち着くんだ',
    'いともたやすく行われるえげつない行為',
    '我が心と行動に一点の曇りなし全てが正義だ',
    'だがそれが逆に妹の夫の逆鱗に触れた',
    '法律が許すならオメーらの命なんてどーでもいいけどさあ',
    'だが断る',
    'うるさいわね！勝手に赤になった信号が悪いのよ',
    '質問を質問で返すな',
    'マルクはただの若者だった'
];

// ゲーム開始
window.onload = function() {
    prepareGameTextList(); // ゲーム用の問題リストを作成(重複なし)
    startCountdown(); //　以下のカウントダウンがロードされたらすぐさま実行される
};

// 配列をシャッフルする関数(Fisher-Yatesアルゴリズム)
function shuffleArray(array) {
    // 元の配列を変更しないようにコピーを作成
    const newArray = [...array];
    
    // 配列の最後から順番に処理
    for (let i = newArray.length - 1; i > 0; i--) {
        // 0からi番目までのランダムな位置を取得
        const j = Math.floor(Math.random() * (i + 1));
        
        // i番目とj番目の要素を入れ替え
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    return newArray;
}

// ゲーム用の問題リストを準備
function prepareGameTextList() {
    // TEXT_LISTをシャッフル
    const shuffled = shuffleArray(TEXT_LIST);
    
    // 最初の10個を取得
    gameTextList = shuffled.slice(0, TOTAL_ROUNDS);
    
    console.log('今回の問題リスト:', gameTextList); // デバッグ
}

// ランダムに文字列を選択
function getRandomText() {
    // gameTextListから現在のラウンドに対応する問題を取得
    return gameTextList[currentRound - 1];
}

// カウントダウン
function startCountdown() {
    const countdownEl = document.getElementById('countdown');
    const movingTextContainer = document.getElementById('moving-text-container');
    
    // カウントダウン中は文字移動エリアを非表示
    movingTextContainer.style.display = 'none';
    
    let count = COUNTDOWN_TIME;
    countdownEl.textContent = count;
    
    const interval = setInterval(() => {
        count--; // カウントを一つずつ減らすという意味　count - 1
        if (count > 0) {
            countdownEl.textContent = count;
        } else { // カウントが0になったら、
            clearInterval(interval); // インターバルの繰り返し処理を終了
            countdownEl.style.display = 'none'; // カウントダウン表示を停止
            movingTextContainer.style.display = 'block'; // テキストが動くブロックを表示
            showMovingText(); // ゲームが始まる
        }
    }, 1000);
}

// 文字を移動表示
function showMovingText() {
    targetText = getRandomText();
    const movingTextEl = document.getElementById('moving-text');
    
    // 文字列を設定
    movingTextEl.textContent = targetText;
    
    const textLength = targetText.length;
    const moveDuration = MOVE_DURATION + (textLength * DURATION_PER_CHAR);

    console.log(`文字: ${targetText}`);
    console.log(`文字数: ${textLength}`);
    console.log(`アニメーション時間: ${moveDuration}ms`);

    // アニメーションを設定
    movingTextEl.style.animation = `moveText ${moveDuration}ms linear`;
    // movingTextEl.style.animationで、要素の animation CSSプロパティを設定している　JSから直接CSSを操作する
    // `moveText ${MOVE_DURATION}ms linear`、これは一定の速度で一秒間テキストが動く

    // アニメーション終了後に入力画面に切り替え
    setTimeout(() => { // 一定時間後に一度処理を実行する
        document.getElementById('display-area').style.display = 'none'; // 1秒後に文字表示エリアが非表示
        document.getElementById('input-area').style.display = 'block'; // テキストが表示された1秒後にテキスト入力欄が表示される
        document.getElementById('user-input').focus(); // テキスト入力欄が表示されると自動でキーボード入力可能状態になる
    }, moveDuration);
}

// 回答をチェック
function checkAnswer() { // 回答ボタン、enter keyを押した時発動
    const userInput = document.getElementById('user-input').value.trim();
    // htmlのuser-inputの情報を取得
    // .valueで入力欄に入力された文字列を取得
    // .trim()で文字列の前後の空白(スペース)を削除, 不要なスペースで不正解にならないようにする
    const feedbackEl = document.getElementById('feedback');
    
    // 入力チェック
    if (userInput === '') { // 入力欄が空かチェック
        alert('文字を入力してください!');
        return;
    }
    
    // 正誤判定
    if (userInput === targetText) { // 入力した言葉が回答と一致するかどうか
        correctCount++; // 正解した場合正解数を＋１
        feedbackEl.textContent = '正解!'; 
        feedbackEl.className = 'feedback correct';
    } else {
        feedbackEl.textContent = `不正解...正解は「${targetText}」でした`;
        feedbackEl.className = 'feedback incorrect';
    }
    
    feedbackEl.style.display = 'block';
    
    // 次の問題へ
    setTimeout(() => {
        nextRound();
    }, 1500); // 1.5秒後に次のゲームに進む
}

// 次の問題へ
function nextRound() {
    currentRound++;
    
    if (currentRound > TOTAL_ROUNDS) {
        // ゲーム終了
        finishGame();
        return;
    }
    
    // 画面をリセット
    document.getElementById('user-input').value = ''; // 入力欄に入力された文字を空にする
    document.getElementById('feedback').style.display = 'none'; // 正解不正解のメッセージを非表示にする
    document.getElementById('input-area').style.display = 'none'; // 入力欄を非表示
    document.getElementById('display-area').style.display = 'block'; // 動く文字表示エリアを表示
    
    // ラウンド表示を更新
    document.getElementById('current-round').textContent = currentRound; // 次の問題に行った際に、現在の問題数を更新
    
    // 次の文字を表示
    showMovingText();
}

// ゲーム終了
function finishGame() {
    location.href = `result.html?correct=${correctCount}&total=${TOTAL_ROUNDS}`;
}

// Enterキーで送信
document.addEventListener('DOMContentLoaded', function() {
    const inputEl = document.getElementById('user-input');
    if (inputEl) {
        inputEl.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
});
