// 网站运行时间统计
function updateRuntime() {
    const startDate = new Date('2025-10-28'); // 注意：修改为您的建站日期
    const currentDate = new Date();
    const diff = currentDate - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const runtimeElement = document.getElementById('runtime-count');
    if (runtimeElement) {
        runtimeElement.innerHTML = `本站已运行 ${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
    }
}

// 每秒更新一次
setInterval(updateRuntime, 1000);
updateRuntime(); // 立即执行一次