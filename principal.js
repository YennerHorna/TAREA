var juego= new Phaser.Game(700, 500, Phaser.CANVAS, 'bloque_juego');
var fondoJuego;
var boton;
var persoaje;
var moneda;
var capaInicio;
var capaFinal;
var juegoIniciado=false;
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;
var teclaSalto;
var musicaFondo;
var textoMonedas;
var textoNivel;
var monedasRecolectadas=0;
var nivelActual=1;
var metasMonedas=[5,10];
var juegoCompletado=false;
var pisoArriba=380;
var pisoAbajo=500;
var velocidadPersonaje=4;
var fuerzaSalto=520;
var gravedadPersonaje=1200;
var posicionSueloPersonaje=pisoArriba;
var velocidadSalto=0;
var alturaSalto=0;
var estaSaltando=false;

var estadoPrincipal={
	preload: function () {
		// carga todos los recursos
		juego.load.image('fondo','img/bg.png');
		juego.load.image('boton','img/btn.png');
		juego.load.spritesheet('personaje','img/Personaje.png',320,320);
		juego.load.spritesheet('moneda','img/animaci\u00f3n_moneda.png',80,80);
		juego.load.audio('musica','music/bg.mp3');
	},
	create: function(){
	//mostrar pantalla
		monedasRecolectadas=0;
		nivelActual=1;
		juegoCompletado=false;
		juegoIniciado=false;
		posicionSueloPersonaje=pisoArriba;
		velocidadSalto=0;
		alturaSalto=0;
		estaSaltando=false;

		juego.physics.startSystem(Phaser.Physics.ARCADE);
		fondoJuego=juego.add.tileSprite(0,0,700,500,'fondo');
		moneda=juego.add.sprite(520,300,'moneda');
		moneda.scale.setTo(0.55,0.55);
		moneda.animations.add('girar',[0,1,2,3,4],5,true);
		moneda.animations.play('girar');
		persoaje=juego.add.sprite(100,100,'personaje');
		persoaje.scale.setTo(0.35,0.35);
		persoaje.anchor.setTo(0.5,0);
		persoaje.y=posicionSueloPersonaje-persoaje.height;
		persoaje.frame=0;
		persoaje.animations.add('caminar',[1,2,3,4,5],10,true);
		juego.physics.arcade.enable(persoaje);
		juego.physics.arcade.enable(moneda);
		textoNivel=juego.add.text(20,20,'Nivel: 1',{font:'24px Arial',fill:'#000000'});
		textoMonedas=juego.add.text(20,50,'Monedas: 0 / '+metasMonedas[0],{font:'24px Arial',fill:'#000000'});
		reubicarMoneda();
		musicaFondo=juego.add.audio('musica');
		musicaFondo.loop=true;
		musicaFondo.play();
		teclaDerecha=juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		teclaIzquierda=juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		teclaArriba=juego.input.keyboard.addKey(Phaser.Keyboard.UP);
		teclaAbajo=juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		teclaSalto=juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		mostrarInicio();

	},
	update: function(){
		if (!juegoIniciado || juegoCompletado) {
			return;
		}

		//animamos el juego
		fondoJuego.tilePosition.x-=1;
		if (teclaSalto.justDown && !estaSaltando) {
			estaSaltando=true;
			velocidadSalto=-fuerzaSalto;
		}
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
			posicionSueloPersonaje-=velocidadPersonaje;
		}
		else if (teclaAbajo.isDown) {
			persoaje.animations.play('caminar');
			posicionSueloPersonaje+=velocidadPersonaje;
		} else {
			persoaje.animations.stop();
			persoaje.frame=0;
		}

		if (estaSaltando) {
			alturaSalto+=velocidadSalto*juego.time.physicsElapsed;
			velocidadSalto+=gravedadPersonaje*juego.time.physicsElapsed;

			if (alturaSalto>=0) {
				alturaSalto=0;
				velocidadSalto=0;
				estaSaltando=false;
			}
		}

		posicionSueloPersonaje=Math.max(pisoArriba,Math.min(posicionSueloPersonaje,pisoAbajo));
		persoaje.y=posicionSueloPersonaje-persoaje.height+alturaSalto;
		persoaje.x=Math.max(Math.abs(persoaje.width)/2,Math.min(persoaje.x,juego.width-Math.abs(persoaje.width)/2));
		juego.physics.arcade.overlap(persoaje,moneda,recolectarMoneda,null,this);
	}
};

function recolectarMoneda(){
	if (juegoCompletado) {
		return;
	}

	monedasRecolectadas++;
	if (monedasRecolectadas>=metasMonedas[nivelActual-1]) {
		nivelActual++;
		monedasRecolectadas=0;

		if (nivelActual>2) {
			juegoCompletado=true;
			moneda.kill();
			mostrarFinal();
			return;
		}
	}

	textoNivel.text='Nivel: '+nivelActual;
	textoMonedas.text='Monedas: '+monedasRecolectadas+' / '+metasMonedas[nivelActual-1];
	reubicarMoneda();
}

function reubicarMoneda(){
	moneda.x=juego.rnd.integerInRange(80,juego.width-100);
	if (juego.rnd.integerInRange(1,2)===1) {
		moneda.y=juego.rnd.integerInRange(pisoArriba-100,pisoAbajo-100);
	} else {
		moneda.y=juego.rnd.integerInRange(pisoArriba-170,pisoAbajo-170);
	}
}

function mostrarInicio(){
	capaInicio=juego.add.group();
	var fondo=juego.add.graphics(0,0);
	fondo.beginFill(0x000000,0.35);
	fondo.drawRect(0,0,juego.width,juego.height);
	fondo.endFill();
	capaInicio.add(fondo);

	boton=juego.add.button(juego.world.centerX,juego.world.centerY,'boton',iniciarJuego,this);
	boton.anchor.setTo(0.5,0.5);
	boton.width=190;
	boton.height=75;
	capaInicio.add(boton);

	var textoPlay=juego.add.text(juego.world.centerX,juego.world.centerY,'PLAY',{font:'32px Arial',fill:'#000000',fontWeight:'bold'});
	textoPlay.anchor.setTo(0.5,0.5);
	capaInicio.add(textoPlay);
}

function iniciarJuego(){
	juegoIniciado=true;
	capaInicio.destroy();
}

function mostrarFinal(){
	capaFinal=juego.add.group();
	var fondo=juego.add.graphics(0,0);
	fondo.beginFill(0x000000,0.35);
	fondo.drawRect(0,0,juego.width,juego.height);
	fondo.endFill();
	capaFinal.add(fondo);

	var textoFinal=juego.add.text(juego.world.centerX,180,'Juego completado',{font:'42px Arial',fill:'#ffffff',fontWeight:'bold'});
	textoFinal.anchor.setTo(0.5,0.5);
	capaFinal.add(textoFinal);

	var botonReiniciar=juego.add.button(juego.world.centerX,280,'boton',reiniciarJuego,this);
	botonReiniciar.anchor.setTo(0.5,0.5);
	botonReiniciar.width=230;
	botonReiniciar.height=75;
	capaFinal.add(botonReiniciar);

	var textoReiniciar=juego.add.text(juego.world.centerX,280,'REINICIAR',{font:'26px Arial',fill:'#000000',fontWeight:'bold'});
	textoReiniciar.anchor.setTo(0.5,0.5);
	capaFinal.add(textoReiniciar);
}

function reiniciarJuego(){
	juego.state.restart();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');
