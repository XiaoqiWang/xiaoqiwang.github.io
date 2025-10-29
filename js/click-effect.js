// 鼠标点击爱心特效
// 每次点击页面时，在点击位置显示一个上浮的爱心

document.addEventListener('click', function(e) {
    // 创建爱心元素
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.innerHTML = '❤'; // 红心 emoji

    // 设置样式
    heart.style.cssText = `
        position: fixed;
        color: #ff6b6b;
        font-size: 20px;
        z-index: 9999;
        pointer-events: none;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        animation: heartFloat 1s ease-out forwards;
        user-select: none;
    `;

    // 添加到页面
    document.body.appendChild(heart);

    // 动画结束后移除元素，避免 DOM 堆积
    setTimeout(() => {
        heart.remove();
    }, 1000);
});

// 添加动画样式（只添加一次）
if (!document.querySelector('#click-effect-style')) {
    const style = document.createElement('style');
    style.id = 'click-effect-style';
    style.textContent = `
        @keyframes heartFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(1.5);
            }
        }
    `;
    document.head.appendChild(style);
}