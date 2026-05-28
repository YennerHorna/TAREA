var juego= new Phaser.Game(700, 500, Phaser.CANVAS, 'bloque_juego');
var fondoJuego;
var boton;
var persoaje;
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;
var musicaFondo;
var pisoArriba=380;
var pisoAbajo=500;
var velocidadPersonaje=4;

var estadoPrincipal={
	preload: function () {
		// carga todos los recursos
		juego.load.image('fondo','img/bg.png');
		juego.load.spritesheet('personaje','img/Personaje.png',320,320);
		juego.load.audio('musica','music/bg.mp3');
	},
	create: function(){
	//mostrar pantalla
		fondoJuego=juego.add.tileSprite(0,0,700,500,'fondo');
		persoaje=juego.add.sprite(100,100,'personaje');
		persoaje.scale.setTo(0.35,0.35);
		persoaje.anchor.setTo(0.5,0);
		persoaje.y=pisoArriba-persoaje.height;
		persoaje.frame=0;
		persoaje.animations.add('caminar',[1,2,3,4,5],10,true);
		musicaFondo=juego.add.audio('musica');
		musicaFondo.loop=true;
		musicaFondo.play();
		teclaDerecha=juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		teclaIzquierda=juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		teclaArriba=juego.input.keyboard.addKey(Phaser.Keyboard.UP);
		teclaAbajo=juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);

	},
	update: function(){
		//animamos el juego
		fondoJuego.tilePosition.x-=1;
		if (teclaDerecha.isDown) {
			persoaje.animations.play('caminar');
			persoaje.scale.x=0.35;
			persoaje.x+=velocidadPersonaje;
		}
		else if (teclaIzquierda.isDown) {
			persoaje.animations.play('caminar');
			persoaje.scale.x=-0.35;
			persoaje.x-=velocidadPersonaje;
		}
		else if (teclaArriba.isDown) {
			persoaje.animations.play('caminar');
			persoaje.y-=velocidadPersonaje;
		} else if (teclaAbajo.isDown) {
			persoaje.animations.play('caminar');
			persoaje.y+=velocidadPersonaje;
		} else {
			persoaje.animations.stop();
			persoaje.frame=0;
		}
		persoaje.x=Math.max(Math.abs(persoaje.width)/2,Math.min(persoaje.x,juego.width-Math.abs(persoaje.width)/2));
		persoaje.y=Math.max(pisoArriba-persoaje.height,Math.min(persoaje.y,pisoAbajo-persoaje.height));
	}
};

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');
