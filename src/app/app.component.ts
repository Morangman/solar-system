import { Component, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('solar') canvasEl: ElementRef;

    /** Canvas 2d context */
    private ctx: CanvasRenderingContext2D;

    private planetMass: number = 1;
    private planetDistance: number = 1;
    private planetRadius: number = 4.2588e-5 * this.planetDistance;
    private planetAroundSun: number = 365.2564;

    private fps: number = 5;

    private integration: number  = 0.6;

    private planets = [];

    private canvasWidth: number = 1920;
    private canvasHeight: number = 1080;

    private scale: number = 50;
    private w: number;
    private h: number;
    private yearEarth: number = 0;
    private x: number = 0;

    private pic: HTMLImageElement = new Image();
    private background: HTMLImageElement = new Image();
    private ship: HTMLImageElement = new Image();

    public  animation: boolean = false;

    constructor() {}

    ngOnInit() {
        this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');

        this.background.src = "assets/background.jpg";
        this.ship.src = "assets/ship2.png";

            //добавление в массив planets данных о планетах
        this.planets.push
        (
            {name:"Sun",
                mass: 333000 * this.planetMass,
                distance: 0.001 * this.planetDistance,
                radius: 1500 * this.planetRadius,
                time_around_Sun: 60,
                phase: 0,
                file:"sss.png"
            },

            {name:"Mercury",
                mass: 0.05527 * this.planetMass,
                distance: 0.387 * this.planetDistance,
                radius: 0.3829 * this.planetRadius,
                time_around_Sun: 87.97,
                phase: 0,
                file:"merc.png"
            },

            {name:"Venus",
                mass: 0.815 * this.planetMass,
                distance: 0.623 * this.planetDistance,
                radius: 0.949 * this.planetRadius,
                time_around_Sun: 224.7,
                phase: 0,
                file:"venus.png"
            },

            {name:"Earth",
                mass: this.planetMass,
                distance: this.planetDistance,
                radius: this.planetRadius,
                time_around_Sun: this.planetAroundSun,
                phase: 0,
                file:"globe.png"
            },

            {name:"Mars",
                mass: 0.107 * this.planetMass,
                distance: 1.523 * this.planetDistance,
                radius: 0.532 * this.planetRadius,
                time_around_Sun: 1.88 * this.planetAroundSun,
                phase: 0,
                file:"mars.png"
            },

            {name:"Jupiter",
                mass: 317.8 * this.planetMass,
                distance: 4 * this.planetDistance,
                radius: 10.97 * this.planetRadius,
                time_around_Sun: 11.86 * this.planetAroundSun,
                phase: 0,
                file:"jupiter.png"
            },

            {name:"Saturn",
                mass: 95.2 * this.planetMass,
                distance: 9.54 * this.planetDistance,
                radius: 9.45 * this.planetRadius,
                time_around_Sun: 29.46 * this.planetAroundSun,
                phase: 0,
                file:"saturn.png"
            },

            {name:"Uranus",
                mass: 14.53 * this.planetMass,
                distance: 19.19 * this.planetDistance,
                radius: 4 * this.planetRadius,
                time_around_Sun: 84.02 * this.planetAroundSun,
                phase: 0,
                file:"uranus.png"
            },

            {name:"Neptune",
                mass: 17.14 * this.planetMass,
                distance: 30.06 * this.planetDistance,
                radius: 3.88 * this.planetRadius,
                time_around_Sun: 164.78 * this.planetAroundSun,
                phase: 0,
                file:"neptune.png"
            },

            {name:"Pluto",
                mass: 0.0022 * this.planetMass,
                distance: 39.53 * this.planetDistance,
                radius:0.18 * this.planetRadius,
                time_around_Sun: 248.09 * this.planetAroundSun,
                phase: 0,
                file:"pluto2.png"
            }
        );

        this.draw(); //вызов главного метода
    }

    mainAnimation() {

        for (let i = 0; i < this.planets.length; i++) {
            this.planets[i]['phase'] += this.planetAroundSun * this.integration / this.planets[i]['time_around_Sun'];
        }
    }

    solar(){

        if(this.animation === true){
            this.mainAnimation();
        }

        for (let i = 0; i < this.planets.length; i++){
            if (!this.planets[i]['file']) continue;
            let pic = new Image();
            pic.src = "assets/" + this.planets[i]['file'];
            this.planets[i].pic  = pic;
        }

        this.w = this.canvasWidth / this.scale;
        this.h = this.canvasHeight / this.scale;

        //this.ctx.fillStyle = "black"; //фон канваса
        this.ctx.fillRect(0, 0, this.w * this.scale, this.h * this.scale);
        this.ctx.drawImage(this.background, 0, 0, this.canvasWidth, this.canvasHeight);

        for (let i = 0; i < this.planets.length; i++) {
            let p = this.planets[i];
            let ro = 1.9 * Math.log(1 + 2.5 * p['distance'] / this.planetDistance) * this.planetDistance;
            let fi = p['phase'] / 180 * Math.PI;
            let xS = (this.w / 2 + ro * Math.cos(fi)) * this.scale;
            let yS = (this.h / 2 + ro * Math.sin(fi)) * this.scale;

            //Отображение орбит
            this.ctx.beginPath(); 
            this.ctx.arc(this.w / 2 * this.scale, this.h / 2 * this.scale, ro * this.scale, 0,
                2 * Math.PI, false);
            this.ctx.strokeStyle = "#627f78";
            this.ctx.stroke();

            //Отображение планет
            p.pic.onload = () => {
                let r = 0.1 * Math.log(1 + 8 * p['radius'] / this.planetRadius) * this.planetDistance * this.scale;
                let wh = p.pic.width / p.pic.height;
                this.ctx.drawImage(p.pic, xS - r * wh, yS - r, r * 2 * wh, r * 2);

                if(this.yearEarth === 1){
                    this.ctx.drawImage(this.ship, this.x, 650, 35, 35);
                    this.x++;
                }
            }
        }

        this.ctx.font = '20pt Arial';
        this.ctx.fillStyle = "white"; this.ctx.fillText('Years: ' + this.yearEarth , 1500, 120);

        if (parseInt(this.planets[3].phase) > 360 * (this.yearEarth + 1) && parseInt(this.planets[3].phase)  != 0) {
            this.yearEarth++;
        }
    }

    animStart(){ this.animation = true; } //кнопка старт

    animStop(){ this.animation = false; } //кнопка стоп

    draw() {

        setInterval(() => { this.solar() }, 100 / this.fps); //пуск анимации
    }
}