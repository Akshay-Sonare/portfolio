/**
 * Skills Physics Interaction
 * 
 * Transforms the Skills grid into an interactive physics playground.
 * Icons fall as physical blocks when scrolled into view.
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('skills-physics-container');
    const staticGrid = document.getElementById('skills-static-grid');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!container || !staticGrid || typeof Matter === 'undefined') return;

    // Module aliases
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    // State management
    let engine, world, render, runner;
    let ground, leftWall, rightWall;
    let hasDropped = false;

    // Skill icons metadata
    const skills = Array.from(skillCards).map(card => ({
        label: card.getAttribute('data-skill-label'),
        logoUrl: card.getAttribute('data-skill-logo'),
        color: '#F7A501'
    }));

    // Preload logos
    const logoImages = {};
    skills.forEach(skill => {
        if (skill.logoUrl) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = skill.logoUrl;
            logoImages[skill.logoUrl] = img;
        }
    });

    function initPhysics() {
        if (render) return; // Already initialized

        const width = container.clientWidth || 1200;
        const height = 400;

        engine = Engine.create();
        world = engine.world;

        render = Render.create({
            element: container,
            engine: engine,
            options: {
                width: width,
                height: height,
                background: 'transparent',
                wireframes: false,
                pixelRatio: window.devicePixelRatio
            }
        });

        // Create boundaries
        const ground = Bodies.rectangle(
            width / 2, height + 30, width * 2, 60,
            { isStatic: true, render: { visible: false } }
        );
        const leftWall = Bodies.rectangle(
            -30, height / 2, 60, height * 2,
            { isStatic: true, render: { visible: false } }
        );
        const rightWall = Bodies.rectangle(
            width + 30, height / 2, 60, height * 2,
            { isStatic: true, render: { visible: false } }
        );

        Composite.add(world, [ground, leftWall, rightWall]);

        // Mouse interaction
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Composite.add(world, mouseConstraint);
        render.mouse = mouse;

        // Custom rendering for logos and text
        Events.on(render, 'afterRender', () => {
            const context = render.context;
            const bodies = Composite.allBodies(world);

            bodies.forEach(body => {
                if (body.skillMetadata) {
                    const { x, y } = body.position;
                    const angle = body.angle;

                    context.save();
                    context.translate(x, y);
                    context.rotate(angle);

                    // Draw background card (80x80)
                    const size = 80;
                    context.fillStyle = '#1e1e1e';
                    context.strokeStyle = body.isDragging ? '#F7A501' : '#333';
                    context.lineWidth = 2;
                    context.beginPath();
                    context.roundRect(-size / 2, -size / 2, size, size, 8);
                    context.fill();
                    context.stroke();

                    // Draw Logo Image
                    const logoImg = logoImages[body.skillMetadata.logoUrl];
                    if (logoImg && logoImg.complete) {
                        const iconSize = 40;
                        // Center image slightly above the label
                        context.drawImage(logoImg, -iconSize / 2, -iconSize / 2 - 8, iconSize, iconSize);
                    } else if (body.skillMetadata.logoUrl) {
                        context.fillStyle = '#444';
                        context.beginPath();
                        context.arc(0, -8, 15, 0, Math.PI * 2);
                        context.fill();
                    }

                    // Draw Label
                    context.font = 'bold 10px "Inter"';
                    context.fillStyle = '#fff';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillText(body.skillMetadata.label.toUpperCase(), 0, 20);

                    context.restore();
                }
            });
        });

        // Run
        Render.run(render);
        runner = Runner.create();
        Runner.run(runner, engine);
    }

    function spawnSkillBlocks() {
        if (hasDropped) return;

        // Ensure container is visible before sizing
        staticGrid.classList.add('physics-active');
        container.classList.add('active');

        // Defer init until container has width
        setTimeout(() => {
            initPhysics();
            hasDropped = true;

            const width = container.clientWidth || 1200;

            skills.forEach((skill, index) => {
                const x = Math.random() * width;
                const y = Math.random() * -600 - 50;
                const size = 80;

                const block = Bodies.rectangle(x, y, size, size, {
                    restitution: 0.6,
                    friction: 0.1,
                    render: {
                        fillStyle: '#1a1a1a',
                        strokeStyle: '#333',
                        lineWidth: 1
                    }
                });

                block.skillMetadata = skill;
                Composite.add(world, block);
            });
        }, 50);
    }

    // Trigger on scroll
    const trigger = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            spawnSkillBlocks();
            trigger.disconnect();
        }
    }, { threshold: 0.3 });

    trigger.observe(staticGrid);

    // Dynamic resizing
    window.addEventListener('resize', debounce(() => {
        const newWidth = container.clientWidth;
        render.canvas.width = newWidth;
        Render.setPixelRatio(render, window.devicePixelRatio);

        // Update walls
        Matter.Body.setPosition(rightWall, { x: newWidth + 30, y: 200 });
        Matter.Body.setPosition(ground, { x: newWidth / 2, y: 400 + 30 });
    }, 250));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
});
