// initialize context
kaboom();

    // load assets
    //sprites
    loadSprite("bean", "sprites/bean.png");
    loadSprite("conveyor", "sprites/conveyor.png");
    loadSprite("truck1", "sprites/truck1case.png");
    loadSprite("truck2", "sprites/truck2cases.png");
    loadSprite("truck3", "sprites/truck3cases.png");
    loadSprite("truck4", "sprites/truck4cases.png");
    loadSprite("truck5", "sprites/truck5cases.png");
    loadSprite("truck6", "sprites/truck6cases.png");
    loadSprite("truck7", "sprites/truck7cases.png");
    loadSprite("truck8", "sprites/truck8cases.png");
    loadSprite("truck", "sprites/truck.png");
    loadSprite("box", "sprites/box.png");
    loadSprite("box2", "sprites/box2.png");
    loadSprite("box4", "sprites/box4.png");
    loadSprite("box7", "sprites/box7.png");
    loadSprite("box8", "sprites/box8.png");
    loadSprite("emptybox", "sprites/emptybox.png");
    loadSprite("secret", "sprites/secret.png");
    //sounds
    loadSound("score", "sounds/score.mp3");
    loadSound("coin", "sounds/pickupCoin.mp3")
    loadSound("whoosh", "sounds/whoosh.mp3")
    loadSound("timer", "sounds/timer.mp3")
    loadSound("newBox", "sounds/newBox.mp3")
    loadSound("newTruck", "sounds/newTruck.mp3")
    loadSound("gameOver", "sounds/gameover.mp3")

    //needs to be accessed globally
    let highscore = 0;

    //game scene
    scene('game', () => {
      //remove instructions for desktop controls
      document.getElementById("content-desktop").style.display = "none";
      //audio
      const music = play("timer", {
        volume: 0.2,
        loop: true
      });

      // //background
      const background = add([
        rect(width(), height()),
        pos(0, 0),
        color(200, 200, 200),
      ]);

      // //level map
      const map = [
        '                                                                                ',
        '                                                                                ',
        '                                                                                ',
        '                                                                                ',
        '                                                                                ',
        '                        9999999999999999 88888888888888                         ',
        '                                                                                ',
        '                                                                                ',
        '                          66666666666666 7777777777777777                       ',
        '                                                                                ',
        '                                                                                ',
        '                        5555555555555555 44444444444444                         ',
        '                                                                                ',
        '                                                                                ',
        '                          22222222222222 3333333333333333                       ',
        '                                                                                ',
        '                                                                                ',
        '                        1111111111111111 ==============           ==========    ',
        '                                                                                ',
        '                                                                                '
      ];

      //for levelConfig
      const gridWidth = width()/80;
      const gridHeight = height()/20;
        
      //for playerRight
      const TOP_RIGHT = height()/4.5;
      const MID_RIGHT = height()/2;
      const BOT_RIGHT = height()/1.5;
      const PLAYERRIGHTX = width()/1.3;
      //for playerLeft
      const TOP_LEFT = height()/9.5;
      const MID_LEFT = height()/2.5;
      const BOT_LEFT = height()/1.5;
      const PLAYERLEFTX = width()/4;
      
      //global vars
      SPEED = width() / 10;
      ORIG_SPEED = width() / 10;
      CASES_ON_THE_FLOOR = 0;
      CASES_ON_THE_TRUCK = 0;
      PAUSED = false;
      NEW_CASE = false;
        
      const levelConfig = {
        // grid size
        width: gridWidth,
        height: gridHeight,
        "=" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor=",
          "conveyor",
          {DIRECTION: -1}
        ],
        "1" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor1",
          "conveyor",
          {DIRECTION: -1}
        ],
        "2" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor2",
          "conveyor",
          {DIRECTION: 1}
        ],
        "3" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor3",
          "conveyor",
          {DIRECTION: 1}
        ],
        "4" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor4",
          "conveyor",
          {DIRECTION: -1}
        ],
        "5" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor5",
          "conveyor",
          {DIRECTION: -1}
        ],
        "6" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor6",
          "conveyor",
          {DIRECTION: 1}
        ],
        "7" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor7",
          "conveyor",
          {DIRECTION: 1}
        ],
        "8" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor8",
          "conveyor",
          {DIRECTION: -1}
        ],
        "9" : () => [
          sprite("conveyor", {width: gridWidth, height: gridHeight}),
          area(),
          solid(),
          origin("topleft"),
          "conveyor9",
          "conveyor",
          {DIRECTION: -1}
        ],
      };
        
      addLevel(map, levelConfig);

      add([
        sprite("secret", {width: width()/10, height: height()/1.1}),
        pos(width()/2, height()/10),
        origin("top"),
        z(10)
      ])

      const score = add([
        text("SCORE: 0", {size: height()/15}),
        pos(width()/2, height()/40),
        origin("top"),
        { value: 0 },
      ])

      //miss
      const miss = add([
        text("MISS: 0", {size: height()/15}),
        pos(width()/80, height()/40),
        { value: 0 },
      ])

      // addTruck()
      const truck = add([
        sprite("truck", {width: width()/6, height: height()/2.5}),
        pos(width()/80, height()/1.7),
        // area(),
        // solid(),
        origin("botleft"),
        "truck",
      ])

      const playerLeft = add([
        sprite("bean", {width: width()/12, height: height()/5}),
        pos(width()/4, BOT_LEFT),
        area(),
        origin("top"),
        "playerLeft",
      ])
        
      const playerRight = add([
        sprite("bean", {flipX: true, width: width()/12, height: height()/5}),
        pos(width()/1.3, MID_RIGHT),
        area(),
        origin("top"),
        "playerRight",
      ])

      //ground for miss detection (case and ground collision)
      add([
        pos(0, height()),
        rect(width(), 1),
        area(),
        origin("topleft"),
        "ground"
      ])

      const casewidth = width()/28
      const caseheight = height()/16
      const caseposX = width()/1.08
      const caseposY = height()/1.3

      function addCase() {
        if (!NEW_CASE) {
          play("newBox")///might need to pause or stop
          NEW_CASE = true
          CASES_ON_THE_FLOOR += 1
          add([
            sprite("emptybox", {width: casewidth, height: caseheight}),
            pos(caseposX, caseposY),
            area(),
            origin("topleft"),////
            body(),
            // solid(),
            "cases",
            {DIRECTION: 0, newCase: true , casenum: 0, truck: false }
          ])
        }
      }

      function pauseCases() {
        music.pause();
        SPEED = 0;
        PAUSED = true;
      }

      function moveCases() {
        PAUSED = false;
        SPEED = ORIG_SPEED;
        music.play();
      }

      //add a case immediately if there's none on the floor
      loop(1, () => {
        if (CASES_ON_THE_FLOOR == 0) {
          addCase();
        }
      })

      function randgen() {
        let res = randi(10, 15);
        return res;
      }

      //add a case at random interval
      //////
      loop(3, () => {
        if (!PAUSED) {
          if (!NEW_CASE) {
            let num = 0;
            wait(num = randgen(), () => {
              addCase();
            });
          }
        }
      })
      
      function missed(cases) {
        CASES_ON_THE_FLOOR -= 1;
        pauseCases();
        addKaboom(cases.pos);
        play("whoosh", {volume: 0.2});
        destroy(cases);
        miss.value += 1;
        miss.text = "MISS:" + miss.value;
        shake();
        wait(3, () => {
          moveCases();
        });
      }

      onCollide("ground", "cases", (ground, cases) => {
        if (cases.newCase) {
          NEW_CASE = false;
          cases.newCase = false;
        }
        missed(cases);
      })

      onCollide("cases", "conveyor", (cases, conveyor) => {
        cases.DIRECTION = conveyor.DIRECTION
      })
      onCollide("cases", "conveyor1", (cases, conveyor) => {
        cases.use(sprite('box2', {width: casewidth, height: caseheight}))
      })
      onCollide("cases", "conveyor3", (cases, conveyor) => {
        cases.use(sprite('box4', {width: casewidth, height: caseheight}))
      })
      onCollide("cases", "conveyor5", (cases, conveyor) => {
        cases.use(sprite('box7', {width: casewidth, height: caseheight}))
      })
      onCollide("cases", "conveyor7", (cases, conveyor) => {
        cases.use(sprite('box8', {width: casewidth, height: caseheight}))
      })
      onCollide("cases", "conveyor9", (cases, conveyor) => {
        cases.use(sprite('box', {width: casewidth, height: caseheight}))
      })
      

      onUpdate("cases", (cases) => {

        cases.move(SPEED * cases.DIRECTION, 0)
        if (CASES_ON_THE_FLOOR == 0) {
          NEW_CASE = false
        }
        if (miss.value > 2) {
          music.pause()
          play("gameOver", {volume: 0.1, speed: 1, loop: false})//change sound
          wait(0.8, () => {
            go('end', score.value)
          })
        }
        if (cases.truck) {
          wait(0.1, () => {
            destroy(cases)
          })
        }
        if (CASES_ON_THE_TRUCK == 1) {
          truck.use(sprite('truck1', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 2) {
          truck.use(sprite('truck2', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 3) {
          truck.use(sprite('truck3', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 4) {
          truck.use(sprite('truck4', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 5) {
          truck.use(sprite('truck5', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 6) {
          truck.use(sprite('truck6', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 7) {
          truck.use(sprite('truck7', {width: width()/6, height: height()/2.5}))
        }
        else if (CASES_ON_THE_TRUCK == 8) {
          truck.use(sprite('truck8', {width: width()/6, height: height()/2.5}))
          pauseCases()
          wait(1, () => {
            truck.move(-ORIG_SPEED, 0)
          })
          wait(2, () => {
            CASES_ON_THE_TRUCK = 0
            truck.use(sprite("truck", {width: width()/6, height: height()/2.5}))
            truck.moveTo(width()/80, height()/1.7)
            wait(4, () => {
              moveCases()
            })
          })          
        }
        //score
        score.text = "SCORE: " + score.value
      })

      onKeyPress(() => {
        play("score")
      })
      onMousePress(() => {
        play("score")
      })
        
      //for playerRight
      onKeyPress("up", () => {
        //at BOTTOM
        if (playerRight.pos.y > MID_RIGHT) {
          playerRight.moveTo(PLAYERRIGHTX, MID_RIGHT)
        }
        //at MID
        else if (playerRight.pos.y > TOP_RIGHT) {
          playerRight.moveTo(PLAYERRIGHTX, TOP_RIGHT)
        }
        // play("score")
      })
      //for playerRight
      onKeyPress("down", () => {
        //at TOP
        if (playerRight.pos.y < MID_RIGHT) {
          playerRight.moveTo(PLAYERRIGHTX, MID_RIGHT)
        }
        //at MID
        else if (playerRight.pos.y < BOT_RIGHT) {
          playerRight.moveTo(PLAYERRIGHTX, BOT_RIGHT)
        }
        // play("score")
      })
      //for playerLeft
      onKeyPress("w", () => {
        //at BOT
        if (playerLeft.pos.y > MID_LEFT) {
          playerLeft.moveTo(PLAYERLEFTX, MID_LEFT)
        }
        //at MID
        else if (playerLeft.pos.y > TOP_LEFT) {
          playerLeft.moveTo(PLAYERLEFTX, TOP_LEFT)
        }
        // play("score")
      })
      //for playerLeft
      onKeyPress("s", () => {
        //at TOP
        if (playerLeft.pos.y < MID_LEFT) {
          playerLeft.moveTo(PLAYERLEFTX, MID_LEFT)
        }
        //at MID
        else if (playerLeft.pos.y < BOT_LEFT) {
          playerLeft.moveTo(PLAYERLEFTX, BOT_LEFT)
        }
        // play("score")
      })
      onClick(() => {
        // debug.log("mousePos: " + mousePos().x)
        if (mousePos().x > width()/2) {
          // debug.log("right")
          playerRight.moveTo(width()/1.3, MID_RIGHT)
          if (mousePos().y <= MID_RIGHT) {///+200 magic number for fine tuning
            playerRight.moveTo(width()/1.3, TOP_RIGHT)
            // debug.log("top right")
          }
          if (mousePos().y >= BOT_RIGHT) {///+50 magic number for fine tuning
            playerRight.moveTo(width()/1.3, BOT_RIGHT)
            // debug.log("bot right")
          }
        }
        else {
          if (mousePos().x < width()/2) {
            playerLeft.moveTo(width()/4, MID_LEFT)
            // debug.log("left")
            if (mousePos().y <= MID_LEFT) {///+200 magic number for fine tuning
              playerLeft.moveTo(width()/4, TOP_LEFT)
              // debug.log("top left")
            }
            if (mousePos().y >= BOT_LEFT) {
              playerLeft.moveTo(width()/4, BOT_LEFT)
              // debug.log("bot LEFT")
            }
          }
        }
      })

      // //touch events
      document.addEventListener("touchstart", myFunction);

      function myFunction(ev) {
        if (ev.touches[0].pageX > width()/2) {
          // if (ev.touches[0].pageY <= BOT_RIGHT && ev.touches[0].pageY >= TOP_RIGHT+50) {
          playerRight.moveTo(width()/1.3, MID_RIGHT)
          // debug.log("mid right")
            // console.log(ev.touches[0].screenY)
          // }
          if (ev.touches[0].pageY <= MID_RIGHT) {///magic number
            playerRight.moveTo(width()/1.3, TOP_RIGHT)
            // debug.log("top right")
          }
          if (ev.touches[0].pageY >= BOT_RIGHT) {///magic number
            playerRight.moveTo(width()/1.3, BOT_RIGHT)
            // debug.log("bot right")
          }
          // debug.log("right")
          play("score")
        } else {
          // debug.log("left")
          if (ev.touches[0].pageX < width()/2) {
            playerLeft.moveTo(width()/4, MID_LEFT)
            // debug.log("left")
            if (ev.touches[0].pageY <= MID_LEFT) {///magic number
              playerLeft.moveTo(width()/4, TOP_LEFT)
              // debug.log("top left")
            }
            if (ev.touches[0].pageY >= BOT_LEFT) {
              playerLeft.moveTo(width()/4, BOT_LEFT)
              // debug.log("bot LEFT")
            }
          }
          play("score")
        }
        // console.log("page Y: " + ev.touches[0].pageY)
        // console.log("page X: " + ev.touches[0].pageX)
        // console.log("height: " + height())
        // console.log("mid: " + height()/2)
        // debug.log("touch Y: " + ev.touches[0].pageY)
      }
        
      //collision right
      onCollide("playerRight", "cases", (playerRight, cases) => {
        // console.log("player y" + playerRight.pos.y)
        // console.log("case y" + cases.pos.y)
        if (playerRight.pos.y < cases.pos.y) {
          if (playerRight.pos.y == BOT_RIGHT) {
            cases.moveTo(width()/1.47, height()/1.27)
            NEW_CASE = false
            cases.newCase = false
          }
          else if (playerRight.pos.y == MID_RIGHT) {
            cases.moveTo(width()/1.47, height()/2.05)
            // cases.DIRECTION = cases.DIRECTION * -1
          }
          else {
            cases.moveTo(width()/1.47, height()/5.4)
            // cases.DIRECTION = cases.DIRECTION * -1
          }
        }
        // cases.DIRECTION = 0
        play("coin")
        score.value += 1
      })
      //collision left
      onCollide("playerLeft", "cases", (playerLeft, cases) => {
        
        if (playerLeft.pos.y < cases.pos.y) {
          if (playerLeft.pos.y == BOT_LEFT) {
            cases.moveTo(width()/3.3, height()/1.56)
            // cases.DIRECTION = cases.DIRECTION * -1
          }
          else if (playerLeft.pos.y == MID_LEFT) {
            cases.moveTo(width()/3.3, height()/2.9)
            // cases.DIRECTION = cases.DIRECTION * -1
          }
          else {
            CASES_ON_THE_TRUCK += 1
            CASES_ON_THE_FLOOR -= 1
            cases.casenum = CASES_ON_THE_TRUCK
            cases.truck = true
            cases.moveTo(width()/6, height()/10)
          }  
        }
        // cases.DIRECTION = 0
        play("coin")
        score.value += 1
      })
    })

    scene('end', (score) => {

      if (score >= highscore) {
        highscore = score
      }
      
      const background = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
      ])
      add([
        text("HIGHSCORE: "+ highscore + '\nGame Over!\n' + "SCORE: " + score),
        origin('center'),
        pos(width()/2, height()/2),
      ])
      
      onKeyPress("space", () => {
        go('ready')
      })
      onTouchStart(() => {
        go('ready')
      })
      onMousePress(() => {
        go('ready')
      })
    })

    scene('ready', () => {
      /* Storing user's device details in a variable*/
      let details = navigator.userAgent;
      /* Creating a regular expression 
      containing some mobile devices keywords 
      to search it in details string*/
      let regexp = /android|iphone|kindle|ipad/i;
        /* Using test() method to search regexp in details
      it returns boolean value*/
      let isMobileDevice = regexp.test(details);
        if (isMobileDevice) {
          // document.write("You are using a Mobile Device");
      } else {
        document.getElementById("content-desktop").style.display = "block";
      }
      
      const background = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
      ])
      add([
        text('Ready!'),
        origin('center'),
        pos(width()/2, height()/2),
      ])
      onKeyPress("space", () => {
        go('game')
      })
      onTouchStart(() => {
        go('game')
      })
      onMousePress(() => {
        go('game')
      })
    })

    go('ready')