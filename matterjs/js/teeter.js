var Example = Example || {};
var boardStart = 90,
    Platforms = [],
    totalPlatforms = 7,
    boardWidth = 630,
    boardEnd = boardStart + boardWidth,
    boardHeight = 200,
    counter = boardHeight,
    platformX = 400,
    platformVariance = 400,
    plaformYSpan = 100,
    platformStartY = 300,
    platformSpeed = .5;
Example.catapult = function () {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Vector = Matter.Vector,
        Events = Matter.Events;



    // create engine
    var engine = Engine.create(),
        world = engine.world;
    Events.on(engine, "beforeUpdate", () => {

        if (Platforms.length && Platforms[0].position.y < 0) {

            Platforms.push(makePlatform(Platforms[totalPlatforms - 1].position.y + plaformYSpan))
            //                console.log(Platforms.shift());
            Matter.Composite.remove(world, Platforms[0]);
            Platforms.shift();
        }


        for (i of Platforms) {
            Body.setPosition(i, {
                x: i.position.x,
                y: i.position.y - platformSpeed
            });


        }

//        if (teeth.position.y - circle.position.y < -30) {
//            Matter.Body.setVelocity(circle, {
//                x: 0,
//                y: -5
//            });
//        }
    })

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth * 0.99,
            height: window.innerHeight * 0.75,
            showAngleIndicator: true,
            showCollisions: true

        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var group = Body.nextGroup(true);

    var teeth = Composites.stack(29, 290, 33, 1, 0, 0, function (x, y) {
        return Bodies.polygon(x, 30, 3, 13, {
            angle: Math.PI * 1 / 6,
            isStatic: true,
            collisionFilter: {
                group: group
            }
        });
    });


    var makePlatform = (i) => {

        var platform = Bodies.rectangle(platformX, i, 100, 20, {
            isStatic: true,

            collisionFilter: {
                group: group,
            }

        })
        platformX += (Math.random() - .5) * platformVariance;
        platformX = Math.min(boardEnd, Math.max(boardStart, platformX))
        //console.log( platformX)
        World.add(world, platform);
        return platform;
    }

    Array.from(Array(totalPlatforms).keys()).forEach(function (i) {

        Platforms.push(makePlatform(i * plaformYSpan + platformStartY))

    })


    var circle = Bodies.circle(400, 150, 20, {
        density: 0.005
    });


    World.add(world, [
        teeth,
//        ...Platforms,
        Bodies.rectangle(400, 600, 1900, 50.5, {
            isStatic: true
        }), //ground
        Bodies.rectangle(800, 300, 50, 600, {
            isStatic: true
        }), //wall
        Bodies.rectangle(0, 300, 50, 600, {
            isStatic: true
        }), //wall
        circle,

    ]);

    var updateCircle = (delta) => {
        circle.position.x += delta * 10;
    }


    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: 800,
            y: 600
        }
    });

    // context for MatterTools.Demo
    return {
        update: updateCircle,
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};
