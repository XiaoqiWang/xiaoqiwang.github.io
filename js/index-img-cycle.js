/**
 * Butterfly主题背景图片自动循环功能
 * 根据日期自动切换首页背景图片
 */
(function() {
    'use strict';

    class ButterflyBackgroundCycler {
        constructor() {
            this.totalImages = 24; // 改为24张图片
            this.imageBasePath = '/img/bg';
            this.currentIndex = 1;
            this.bannerElement = null;
            this.cycleInterval = null;
            this.init();
        }

        init() {
            // 只在首页执行
            if (!this.isHomePage()) return;

            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupBackground());
            } else {
                this.setupBackground();
            }
        }

        isHomePage() {
            const path = window.location.pathname;
            return path === '/' ||
                   path === '/index.html' ||
                   path.includes('/page/') ||
                   document.body.classList.contains('home-page');
        }

        setupBackground() {
            this.findBannerElement();
            if (!this.bannerElement) {
                console.warn('Butterfly: 未找到banner元素');
                return;
            }

            // 设置初始背景
            this.currentIndex = this.calculateHourlyImageIndex();
            this.applyBackgroundImage();
            this.preloadNextImage();

            // 启动每小时循环
            this.startHourlyCycle();

            console.log(`Butterfly背景循环: 已设置图片 bg${this.currentIndex}.jpg，每小时自动更换`);
        }

        findBannerElement() {
            // Butterfly主题的banner选择器
            const selectors = [
                '#page-header',
                '.page-header',
                '#banner',
                '.banner',
                '.header'
            ];

            for (const selector of selectors) {
                this.bannerElement = document.querySelector(selector);
                if (this.bannerElement) break;
            }
        }

        calculateHourlyImageIndex() {
            const now = new Date();
            const currentHour = now.getHours(); // 0-23

            // 将24小时映射到24张图片 (0->1, 1->2, ..., 23->24)
            return currentHour + 1;
        }

        applyBackgroundImage() {
            const imageUrl = `${this.imageBasePath}${this.currentIndex}.jpg`;

            // 保存原始背景（用于恢复）
            if (!this.bannerElement.dataset.originalBg) {
                const computedStyle = window.getComputedStyle(this.bannerElement);
                this.bannerElement.dataset.originalBg = computedStyle.backgroundImage;
            }

            // 设置新背景
            this.bannerElement.style.backgroundImage = `url('${imageUrl}')`;

            // 确保背景样式正确
            this.bannerElement.style.backgroundSize = 'cover';
            this.bannerElement.style.backgroundPosition = 'center center';
            this.bannerElement.style.backgroundRepeat = 'no-repeat';

            // 添加过渡效果
            this.bannerElement.style.transition = 'background-image 1.2s ease-in-out';
        }

        preloadNextImage() {
            const nextIndex = (this.currentIndex % this.totalImages) + 1;
            const nextImageUrl = `${this.imageBasePath}${nextIndex}.jpg`;

            const img = new Image();
            img.src = nextImageUrl;
            console.log(`预加载下一张背景: bg${nextIndex}.jpg`);
        }

        startHourlyCycle() {
            // 清除现有定时器
            if (this.cycleInterval) {
                clearInterval(this.cycleInterval);
            }

            // 计算到下一个整点的时间（毫秒）
            const now = new Date();
            const nextHour = new Date(now);
            nextHour.setHours(nextHour.getHours() + 1);
            nextHour.setMinutes(0);
            nextHour.setSeconds(0);
            nextHour.setMilliseconds(0);

            const timeUntilNextHour = nextHour - now;

            console.log(`距离下次背景更换还有: ${Math.round(timeUntilNextHour / 60000)} 分钟`);

            // 设置定时器，在下一个整点开始循环
            setTimeout(() => {
                this.cycleToNextImage();
                // 然后每小时执行一次
                this.cycleInterval = setInterval(() => {
                    this.cycleToNextImage();
                }, 60 * 60 * 1000); // 每小时
            }, timeUntilNextHour);
        }

        cycleToNextImage() {
            // 计算下一个索引
            this.currentIndex = this.calculateHourlyImageIndex();

            // 应用新背景
            this.applyBackgroundImage();

            // 预加载下一张
            this.preloadNextImage();

            const now = new Date();
            console.log(`背景已更换为: bg${this.currentIndex}.jpg (时间: ${now.toLocaleTimeString()})`);
        }

        // 手动切换到下一张图片（用于调试）
        nextImage() {
            this.currentIndex = (this.currentIndex % this.totalImages) + 1;
            this.applyBackgroundImage();
            this.preloadNextImage();
            console.log(`手动切换到: bg${this.currentIndex}.jpg`);
        }

        // 手动切换到指定图片（用于调试）
        setImage(index) {
            if (index >= 1 && index <= this.totalImages) {
                this.currentIndex = index;
                this.applyBackgroundImage();
                this.preloadNextImage();
                console.log(`手动设置背景为: bg${this.currentIndex}.jpg`);
            } else {
                console.warn(`图片索引必须在 1-${this.totalImages} 之间`);
            }
        }

        // 停止自动循环
        stopCycle() {
            if (this.cycleInterval) {
                clearInterval(this.cycleInterval);
                this.cycleInterval = null;
                console.log('背景自动循环已停止');
            }
        }

        // 恢复自动循环
        resumeCycle() {
            if (!this.cycleInterval) {
                this.startHourlyCycle();
                console.log('背景自动循环已恢复');
            }
        }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        window.backgroundCycler = new ButterflyBackgroundCycler();
    });

    // 开发调试功能
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugBackgroundCycle = function() {
            const cycler = new ButterflyBackgroundCycler();
            console.log('手动触发背景循环调试');
        };
    }
})();

//(function() {
//    'use strict';
//
//    class ButterflyBackgroundCycler {
//        constructor() {
//            this.totalImages = 14;
//            this.imageBasePath = '/img/bg';
//            this.currentIndex = 1;
//            this.bannerElement = null;
//            this.init();
//        }
//
//        init() {
//            // 只在首页执行
//            if (!this.isHomePage()) return;
//
//            // 等待DOM加载完成
//            if (document.readyState === 'loading') {
//                document.addEventListener('DOMContentLoaded', () => this.setupBackground());
//            } else {
//                this.setupBackground();
//            }
//        }
//
//        isHomePage() {
//            const path = window.location.pathname;
//            return path === '/' ||
//                   path === '/index.html' ||
//                   path.includes('/page/') ||
//                   document.body.classList.contains('home-page');
//        }
//
//        setupBackground() {
//            this.findBannerElement();
//            if (!this.bannerElement) {
//                console.warn('Butterfly: 未找到banner元素');
//                return;
//            }
//
//            this.currentIndex = this.calculateImageIndex();
//            this.applyBackgroundImage();
//            this.preloadNextImage();
//
//            console.log(`Butterfly背景循环: 已设置图片 bg${this.currentIndex}.jpg`);
//        }
//
//        findBannerElement() {
//            // Butterfly主题的banner选择器
//            const selectors = [
//                '#page-header',
//                '.page-header',
//                '#banner',
//                '.banner',
//                '.header'
//            ];
//
//            for (const selector of selectors) {
//                this.bannerElement = document.querySelector(selector);
//                if (this.bannerElement) break;
//            }
//        }
//
//        calculateImageIndex() {
//            const now = new Date();
//
//            // 方法1：按一年中的天数循环（推荐）
//            const start = new Date(now.getFullYear(), 0, 0);
//            const diff = now - start;
//            const oneDay = 1000 * 60 * 60 * 24;
//            const dayOfYear = Math.floor(diff / oneDay);
//
//            return (dayOfYear % this.totalImages) + 1;
//        }
//
//        applyBackgroundImage() {
//            const imageUrl = `${this.imageBasePath}${this.currentIndex}.jpg`;
//
//            // 保存原始背景（用于恢复）
//            if (!this.bannerElement.dataset.originalBg) {
//                const computedStyle = window.getComputedStyle(this.bannerElement);
//                this.bannerElement.dataset.originalBg = computedStyle.backgroundImage;
//            }
//
//            // 设置新背景
//            this.bannerElement.style.backgroundImage = `url('${imageUrl}')`;
//
//            // 确保背景样式正确
//            this.bannerElement.style.backgroundSize = 'cover';
//            this.bannerElement.style.backgroundPosition = 'center center';
//            this.bannerElement.style.backgroundRepeat = 'no-repeat';
//
//            // 添加过渡效果
//            this.bannerElement.style.transition = 'background-image 0.8s ease-in-out';
//        }
//
//        preloadNextImage() {
//            const nextIndex = (this.currentIndex % this.totalImages) + 1;
//            const nextImageUrl = `${this.imageBasePath}${nextIndex}.jpg`;
//
//            const img = new Image();
//            img.src = nextImageUrl;
//        }
//    }
//
//    // 初始化
//    document.addEventListener('DOMContentLoaded', function() {
//        new ButterflyBackgroundCycler();
//    });
//
//    // 开发调试功能
//    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//        window.debugBackgroundCycle = function() {
//            const cycler = new ButterflyBackgroundCycler();
//            console.log('手动触发背景循环调试');
//        };
//    }
//})();
//// 动态背景切换系统
//// 功能：根据日期自动切换背景图片，每天显示不同的图片
//(function() {
//    // 步骤1：计算今天是一年中的第几天
//    const now = new Date(); // 获取当前日期
//    const start = new Date(now.getFullYear(), 0, 0); // 获取今年的1月1日
//    const diff = now - start; // 计算时间差（毫秒）
//    const oneDay = 1000 * 60 * 60 * 24; // 一天的毫秒数
//    const dayOfYear = Math.floor(diff / oneDay); // 今天是第几天
//
//    // 步骤2：计算应该显示哪张背景图（1-14 循环）
//    // 使用取余运算，确保结果在 0-13 之间，然后加 1 得到 1-14
//    const bgNumber = (dayOfYear % 14) + 1;
//
//    // 步骤3：构建背景图片的路径
//    const bgPath = `/img/backgrounds/bg${bgNumber}.jpg`;
//
//    // 步骤4：应用背景图片到页面
//    // 创建一个 style 元素，插入自定义 CSS
//    const style = document.createElement('style');
//    style.textContent = `
//        body {
//            background-image: url('${bgPath}') !important;
//            background-size: cover !important;
//            background-position: center !important;
//            background-attachment: fixed !important;
//        }
//
//        /* 为背景添加半透明遮罩，确保文字可读 */
//        #page {
//            position: relative;
//        }
//
//        #page::before {
//            content: '';
//            position: fixed;
//            top: 0;
//            left: 0;
//            right: 0;
//            bottom: 0;
//            background: rgba(255, 255, 255, 0.1);
//            pointer-events: none;
//            z-index: -1;
//        }
//    `;
//
//    // 将 style 元素添加到页面的 head 中
//    document.head.appendChild(style);
//
//    // 在控制台输出当前使用的背景图（方便调试）
//    console.log(`今天是第 ${dayOfYear} 天，使用背景图: bg${bgNumber}.jpg`);
//})();