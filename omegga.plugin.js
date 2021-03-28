math = require('mathjs')



class Scaler {
    constructor(omegga, config, store) {
        this.omegga = omegga;
        this.config = config;
        this.store = store;
    }

    async init() {
        const settings = {
           
        };

        this.omegga.on("chatcmd:set", async (name, setting, ...values) => {
            const player = this.omegga.getPlayer(name);
            if (!player.isHost()) return;
           
        });

        this.omegga.on("chatcmd:scale", async (name, scaleString1, scaleString2, scaleString3) => {
            const player = this.omegga.getPlayer(name);
            if (!player.isHost()) return;
            const playerpos = await player.getPosition();




            const save = await this.omegga.getSaveData();



            this.omegga.broadcast("Reading bricks...");

            var scaleXDec = math.number(math.evaluate(scaleString1));
            var scaleYDec = scaleXDec;
            var scaleZDec = scaleXDec;
            if(scaleString2 != null ) 
                scaleYDec = math.number(math.evaluate(scaleString2));

            if(scaleString3 != null )
                scaleZDec = math.number(math.evaluate(scaleString3));



            const orientationTable = [
                ([x,y,z]) => [ z, -y,  x],
                ([x,y,z]) => [ z, -x, -y],
                ([x,y,z]) => [ z,  y, -x],
                ([x,y,z]) => [ z,  x,  y],

                ([x,y,z]) => [-z,  y,  x],
                ([x,y,z]) => [-z,  x, -y],
                ([x,y,z]) => [-z, -y, -x],
                ([x,y,z]) => [-z, -x,  y],

                ([x,y,z]) => [ y,  z,  x],
                ([x,y,z]) => [ x,  z, -y],
                ([x,y,z]) => [-y,  z, -x],
                ([x,y,z]) => [-x,  z,  y],

                ([x,y,z]) => [-y, -z,  x],
                ([x,y,z]) => [-x, -z, -y],
                ([x,y,z]) => [ y, -z, -x],
                ([x,y,z]) => [ x, -z,  y],

                ([x,y,z]) => [ x,  y,  z],
                ([x,y,z]) => [-y,  x,  z],
                ([x,y,z]) => [-x, -y,  z],
                ([x,y,z]) => [ y, -x,  z],

                ([x,y,z]) => [-x,  y, -z],
                ([x,y,z]) => [ y,  x, -z],
                ([x,y,z]) => [ x, -y, -z],
                ([x,y,z]) => [-y, -x, -z],
            ];





            console.log(orientationTable[0]([1,2,3]))
            save.bricks.forEach((brick) => {

    
                brick.position[0] = Math.floor((brick.position[0] - Math.floor(playerpos[0]))*parseFloat(scaleXDec)) + Math.floor(playerpos[0]);
                brick.position[1] = Math.floor((brick.position[1] - Math.floor(playerpos[1]))*parseFloat(scaleYDec)) + Math.floor(playerpos[1]);
                brick.position[2] = Math.floor((brick.position[2])*parseFloat(scaleZDec));


                //console.log(brick)
                var orientationMapping = orientationTable[brick.rotation + 4*brick.direction];
              
                //orient the scale vector
                var scaleXDecOriented = orientationMapping([scaleXDec, scaleYDec, scaleZDec])[0]
                var scaleYDecOriented = orientationMapping([scaleXDec, scaleYDec, scaleZDec])[1]
                var scaleZDecOriented = orientationMapping([scaleXDec, scaleYDec, scaleZDec])[2]

                brick.size[0] = Math.floor(brick.size[0]*parseFloat(Math.abs(scaleXDecOriented)));
                brick.size[1] = Math.floor(brick.size[1]*parseFloat(Math.abs(scaleYDecOriented)));
                brick.size[2] = Math.floor(brick.size[2]*parseFloat(Math.abs(scaleZDecOriented)));

                

            });



            this.omegga.broadcast("Clearing Bricks..");
            this.omegga.clearAllBricks();


            this.omegga.broadcast("Loading Back..");
            this.omegga.loadSaveData(save, 0, 0, 0, true);


            this.omegga.broadcast("Scale complete.");
        });
    }

    async stop() {

    }
}



module.exports = Scaler;