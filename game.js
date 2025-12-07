const TOTAL_ROUNDS = 10; // 問題数
const COUNTDOWN_TIME = 3; // カウントダウン
const MOVE_DURATION = 1000; // 文字の移動時間(ミリ秒) - 難しい設定

// ゲームの状態
let currentRound = 1;
let correctCount = 0;
let targetText = '';

// 出題する文字列リスト
const TEXT_LIST = [
    'HELLO',
    'WORLD',
    'JAVASCRIPT',
    'PROGRAMMING',
    'RUNTEQ',
    'TRAINING',
    'SPEED',
    'READING',
    'CHALLENGE',
    'SUCCESS',
    'DYNAMIC',
    'VISION',
    'QUICK',
    'FOCUS',
    'MASTER',
    'BRAIN',
    'POWER',
    'SKILL',
    'LEVEL',
    'GAME'
];

// ゲーム開始
window.onload = function() {
    startCountdown(); //　以下のカウントダウンがロードされたらすぐさま実行される
};

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

// ランダムに文字列を選択
function getRandomText() { // ランダムに文字列を取得する関数を定義
    const randomIndex = Math.floor(Math.random() * TEXT_LIST.length); 
    // TEXT_LISTの要素数を取得、 Math.random()は0以上1未満のランダムな小数を生成する
    // つまり、ランダムな小数に配列の長さを掛け算してる
    // Math.floor()は小数点以下を切り捨てる
    return TEXT_LIST[randomIndex];
}

// 文字を移動表示
function showMovingText() {
    targetText = getRandomText();
    const movingTextEl = document.getElementById('moving-text');
    
    // 文字列を設定
    movingTextEl.textContent = targetText;
    
    // アニメーションを設定
    movingTextEl.style.animation = `moveText ${MOVE_DURATION}ms linear`;
    // movingTextEl.style.animationで、要素の animation CSSプロパティを設定している　JSから直接CSSを操作する
    // `moveText ${MOVE_DURATION}ms linear`、これは一定の速度で一秒間テキストが動く

    // アニメーション終了後に入力画面に切り替え
    setTimeout(() => { // 一定時間後に一度処理を実行する
        document.getElementById('display-area').style.display = 'none'; // 1秒後に文字表示エリアが非表示
        document.getElementById('input-area').style.display = 'block'; // テキストが表示された1秒後にテキスト入力欄が表示される
        document.getElementById('user-input').focus(); // テキスト入力欄が表示されると自動でキーボード入力可能状態になる
    }, MOVE_DURATION);
}

// 回答をチェック
function checkAnswer() { // 回答ボタン、enter keyを押した時発動
    const userInput = document.getElementById('user-input').value.trim().toUpperCase();
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
        feedbackEl.textContent = '正解!🎉'; 
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
