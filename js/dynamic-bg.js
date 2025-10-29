// source/js/dynamic-gradient-sky.js

/**
 * Dynamic Gradient Sky Background System (v3 - Advanced Shapes & Physics)
 * 升级：多种星星形状、物理动态、美观的视觉效果
 * 优化：减少30%连接线密度
 */
(function() {

    // --- 第一部分：每日动态渐变背景 ---
    function hslToCss(h, s, l) {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function getDailyGradientColors() {
        const now = new Date();
        const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

        const baseHue = (dayOfYear * 1.5) % 360;
        const hue1 = 30 + 30 * Math.sin(baseHue * Math.PI / 180);
        const hue2 = (hue1 + 45) % 360;

        const saturation1 = 70 + 10 * Math.cos(dayOfYear * Math.PI / 180);
        const saturation2 = 70 + 10 * Math.sin(dayOfYear * Math.PI / 180);

        const lightness1 = 90;
        const lightness2 = 92;

        return [
            hslToCss(hue1, saturation1, lightness1),
            hslToCss(hue2, saturation2, lightness2)
        ];
    }

    function applyGradientBackground() {
        const [color1, color2] = getDailyGradientColors();
        const style = document.createElement('style');

        style.id = 'dynamic-gradient-style';
        style.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -2;
                background: linear-gradient(135deg, ${color1}, ${color2});
                background-size: 200% 200%;
                animation: gradient-animation 20s ease infinite;
            }

            @keyframes gradient-animation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        console.log(`Daily gradient set: ${color1}, ${color2}`);
    }

    // --- 第二部分：高级动态星空（优化连接线密度） ---
    class AdvancedStarrySky {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: 0, y: 0, radius: 100 };
            this.config = {
                particleCount: Math.max(window.innerWidth / 2, 200),
                connectionDistance: 150, // 增加连接距离，但减少连接概率
                repulsionForce: 0.5,
                gravity: 0.05,
                baseOpacity: 0.8,
                connectionChance: 0.3, // 新增：30%的连接概率
                maxConnectionsPerParticle: 3 // 新增：每个粒子最多3个连接
            };

            this.init();
        }

        init() {
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.mixBlendMode = 'overlay';

            document.body.insertBefore(this.canvas, document.body.firstChild);

            this.resize();
            window.addEventListener('resize', () => this.resize());
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            this.createParticles();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.particles = [];
            this.config.particleCount = Math.max(window.innerWidth / 2, 200);
            this.createParticles();
        }

        createParticles() {
            for (let i = 0; i < this.config.particleCount; i++) {
                this.particles.push(this.createParticle());
            }
        }

        createParticle() {
            const types = ['star', 'glow', 'sparkle', 'crystal', 'comet'];
            const type = types[Math.floor(Math.random() * types.length)];

            const size = type === 'comet' ?
                Math.random() * 1.5 + 0.8 :
                Math.random() * 2.5 + 0.5;

            const speed = type === 'comet' ?
                Math.random() * 0.8 + 0.3 :
                Math.random() * 0.4 + 0.05;

            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: size,
                baseSize: size,
                speed: speed,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.6 + 0.4,
                baseOpacity: Math.random() * 0.6 + 0.4,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: this.getParticleColor(type),
                trail: type === 'comet' ? [] : null,
                trailLength: type === 'comet' ? 8 : 0,
                connections: [] // 记录当前连接
            };
        }

        getParticleColor(type) {
            const colors = {
                star: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'],
                glow: ['#FF9A8B', '#FF6B6B', '#A8E6CF', '#74B9FF', '#E84393'],
                sparkle: ['#FFFFFF', '#F8EFBA', '#CAD3C8', '#DFE6E9', '#FFEAA7'],
                crystal: ['#81ECEC', '#74B9FF', '#A29BFE', '#FD79A8', '#55E6C1'],
                comet: ['#FFFFFF', '#74B9FF', '#81ECEC']
            };

            const typeColors = colors[type];
            return typeColors[Math.floor(Math.random() * typeColors.length)];
        }

        drawParticle(particle) {
            const twinkle = Math.sin(Date.now() * particle.twinkleSpeed + particle.twinkleOffset) * 0.4 + 0.6;
            const currentOpacity = particle.opacity * twinkle * this.config.baseOpacity;
            const currentSize = particle.size * twinkle;

            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.globalAlpha = currentOpacity;

            switch (particle.type) {
                case 'star':
                    this.drawStar(0, 0, currentSize, currentSize * 0.4, 5, particle.color);
                    break;
                case 'glow':
                    this.drawGlow(0, 0, currentSize, particle.color);
                    break;
                case 'sparkle':
                    this.drawSparkle(0, 0, currentSize, particle.color);
                    break;
                case 'crystal':
                    this.drawCrystal(0, 0, currentSize, particle.color);
                    break;
                case 'comet':
                    this.drawComet(particle);
                    break;
            }

            this.ctx.restore();
        }

        drawStar(x, y, outerRadius, innerRadius, points, color) {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();

            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (Math.PI * i) / points;
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;

                if (i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }

            this.ctx.closePath();
            this.ctx.fill();

            // 添加光晕
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, outerRadius * 3);
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - outerRadius * 3, y - outerRadius * 3, outerRadius * 6, outerRadius * 6);
        }

        drawGlow(x, y, size, color) {
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.7, color + '80');
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - size * 2, y - size * 2, size * 4, size * 4);
        }

        drawSparkle(x, y, size, color) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size * 0.3;

            // 绘制十字形
            this.ctx.beginPath();
            this.ctx.moveTo(x - size, y);
            this.ctx.lineTo(x + size, y);
            this.ctx.moveTo(x, y - size);
            this.ctx.lineTo(x, y + size);
            this.ctx.stroke();

            // 绘制对角线
            this.ctx.beginPath();
            this.ctx.moveTo(x - size * 0.7, y - size * 0.7);
            this.ctx.lineTo(x + size * 0.7, y + size * 0.7);
            this.ctx.moveTo(x - size * 0.7, y + size * 0.7);
            this.ctx.lineTo(x + size * 0.7, y - size * 0.7);
            this.ctx.stroke();
        }

        drawCrystal(x, y, size, color) {
            this.ctx.fillStyle = color;

            // 绘制六边形水晶
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * i) / 3;
                const px = x + Math.cos(angle) * size;
                const py = y + Math.sin(angle) * size;

                if (i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();

            // 添加内部高光
            this.ctx.strokeStyle = '#FFFFFF60';
            this.ctx.lineWidth = size * 0.2;
            this.ctx.stroke();
        }

        drawComet(particle) {
            // 绘制彗星轨迹
            if (particle.trail.length > 1) {
                this.ctx.strokeStyle = particle.color + '30';
                this.ctx.lineWidth = particle.size * 0.5;
                this.ctx.lineCap = 'round';

                this.ctx.beginPath();
                this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

                for (let i = 1; i < particle.trail.length; i++) {
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }
                this.ctx.stroke();
            }

            // 绘制彗星头部
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2);
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.7, particle.color + '80');
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-particle.size * 2, -particle.size * 2, particle.size * 4, particle.size * 4);
        }

        updateParticles() {
            this.particles.forEach(particle => {
                // 物理更新
                particle.x += particle.vx;
                particle.y += particle.vy;

                // 旋转
                particle.rotation += particle.rotationSpeed;

                // 鼠标排斥力
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);

                    particle.vx += Math.cos(angle) * force * this.config.repulsionForce;
                    particle.vy += Math.sin(angle) * force * this.config.repulsionForce;
                }

                // 边界处理
                if (particle.x < -particle.size * 2) particle.x = this.canvas.width + particle.size;
                if (particle.x > this.canvas.width + particle.size * 2) particle.x = -particle.size;
                if (particle.y < -particle.size * 2) particle.y = this.canvas.height + particle.size;
                if (particle.y > this.canvas.height + particle.size * 2) particle.y = -particle.size;

                // 速度衰减
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // 彗星轨迹更新
                if (particle.type === 'comet') {
                    particle.trail.unshift({ x: particle.x, y: particle.y });
                    if (particle.trail.length > particle.trailLength) {
                        particle.trail.pop();
                    }
                }

                // 清空连接记录
                particle.connections = [];
            });
        }

        drawConnections() {
            // 绘制粒子之间的连接线（减少30%密度）
            for (let i = 0; i < this.particles.length; i++) {
                const p1 = this.particles[i];

                // 如果这个粒子已经达到最大连接数，跳过
                if (p1.connections.length >= this.config.maxConnectionsPerParticle) {
                    continue;
                }

                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];

                    // 如果目标粒子已经达到最大连接数，跳过
                    if (p2.connections.length >= this.config.maxConnectionsPerParticle) {
                        continue;
                    }

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.config.connectionDistance) {
                        // 30%概率绘制连接线
                        if (Math.random() < this.config.connectionChance) {
                            const opacity = (1 - distance / this.config.connectionDistance) * 0.2; // 降低不透明度
                            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                            this.ctx.lineWidth = 0.3; // 减小线宽

                            this.ctx.beginPath();
                            this.ctx.moveTo(p1.x, p1.y);
                            this.ctx.lineTo(p2.x, p2.y);
                            this.ctx.stroke();

                            // 记录连接
                            p1.connections.push(j);
                            p2.connections.push(i);

                            // 如果达到最大连接数，跳出内层循环
                            if (p1.connections.length >= this.config.maxConnectionsPerParticle) {
                                break;
                            }
                        }
                    }
                }
            }
        }

        draw() {
            // 使用半透明清除创建拖尾效果
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // 绘制连接线（现在密度减少30%）
            this.drawConnections();

            // 绘制所有粒子
            this.particles.forEach(particle => {
                this.drawParticle(particle);
            });
        }

        animate() {
            this.updateParticles();
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    // --- 启动脚本 ---
    document.addEventListener('DOMContentLoaded', () => {
        applyGradientBackground();
        new AdvancedStarrySky();
    });

})();
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