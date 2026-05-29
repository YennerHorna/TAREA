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

		juego.scale.scaleMode=Phaser.ScaleManager.USER_SCALE;
		juego.scale.setUserScale(1.25,1.25);
		juego.scale.refresh();
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

	boton=crearBotonCss(juego.world.centerX,juego.world.centerY,190,75,'PLAY',iniciarJuego,32);
	capaInicio.add(boton);
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

	var botonReiniciar=crearBotonCss(juego.world.centerX,280,230,75,'REINICIAR',reiniciarJuego,26);
	capaFinal.add(botonReiniciar);
}

function reiniciarJuego(){
	juego.state.restart(true,false);
}

function crearBotonCss(x,y,ancho,alto,texto,callback,tamanoFuente){
	var grupo=juego.add.group();
	grupo.x=x-ancho/2;
	grupo.y=y-alto/2;

	var texturaNormal=crearTexturaBoton(ancho,alto,texto,tamanoFuente,0xffd34d);
	var texturaHover=crearTexturaBoton(ancho,alto,texto,tamanoFuente,0xffe17a);
	var botonCss=juego.add.button(0,0,texturaNormal,callback,this);
	botonCss.input.useHandCursor=true;
	botonCss.onInputOver.add(function(){
		botonCss.loadTexture(texturaHover);
	},this);
	botonCss.onInputOut.add(function(){
		botonCss.loadTexture(texturaNormal);
	},this);
	grupo.add(botonCss);

	return grupo;
}

function crearTexturaBoton(ancho,alto,texto,tamanoFuente,colorFondo){
	var textura=juego.add.bitmapData(ancho+8,alto+10);
	var ctx=textura.ctx;
	var radio=16;

	ctx.fillStyle='rgba(0,0,0,0.25)';
	dibujarRectanguloRedondeado(ctx,5,7,ancho,alto,radio);
	ctx.fill();

	ctx.fillStyle='#'+colorFondo.toString(16);
	ctx.strokeStyle='#ffffff';
	ctx.lineWidth=3;
	dibujarRectanguloRedondeado(ctx,0,0,ancho,alto,radio);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle='#000000';
	ctx.font='bold '+tamanoFuente+'px Arial';
	ctx.textAlign='center';
	ctx.textBaseline='middle';
	ctx.fillText(texto,ancho/2,alto/2+2);
	textura.dirty=true;

	return textura;
}

function dibujarRectanguloRedondeado(ctx,x,y,ancho,alto,radio){
	ctx.beginPath();
	ctx.moveTo(x+radio,y);
	ctx.lineTo(x+ancho-radio,y);
	ctx.quadraticCurveTo(x+ancho,y,x+ancho,y+radio);
	ctx.lineTo(x+ancho,y+alto-radio);
	ctx.quadraticCurveTo(x+ancho,y+alto,x+ancho-radio,y+alto);
	ctx.lineTo(x+radio,y+alto);
	ctx.quadraticCurveTo(x,y+alto,x,y+alto-radio);
	ctx.lineTo(x,y+radio);
	ctx.quadraticCurveTo(x,y,x+radio,y);
	ctx.closePath();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');
