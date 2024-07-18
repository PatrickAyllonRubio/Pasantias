import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';

// Componentes
import Prenda1 from './componentes/prenda1';
import Prenda2 from './componentes/prenda2';
import Prenda3 from './componentes/prenda3';
import Prenda4 from './componentes/prenda4';
import Header from './componentes/header';
import Menu from './componentes/menu';
import Submenu from './componentes/submenu';
import './styles.css';

// avatares
import avatarImage1 from './imagenes/avatar.png';
import avatarImage2 from './imagenes/avatar2.png';
import avatarImage3 from './imagenes/avatar3.png';
import avatarImage4 from './imagenes/avatar4.png';
import avatarImage5 from './imagenes/avatar5.png';

// Prendas para el carrusel
import polo1 from './imagenes/polo1.png';
import polo3 from './imagenes/polo3.png';
import polomangalarga1 from './imagenes/polomangalarga1.png';
import polomangalarga2 from './imagenes/polomangalarga2.png';
import poloabierto2 from './imagenes/poloabierto2.png';
import poncho1 from './imagenes/poncho1.png';

// Prendas para dibujar en el avatar
import polo1A from './imagenes/polo1A.png';
import polo3A from './imagenes/polo3A.png';
import polomangalarga1A from './imagenes/polomangalarga1A.png';
import polomangalarga2A from './imagenes/polomangalarga2A.png';
import poloabierto2A from './imagenes/poloabierto2A.png';
import poncho1A from './imagenes/poncho1A.png';

// Pantalones
import pantalon1 from './imagenes/pantalon1.png';
import pantalon2 from './imagenes/pantalon2.png';
import pantalon3 from './imagenes/pantalon3.png';

// Calzado
import zapatos from './imagenes/zapatos1.png';

// Logo
import logo from './imagenes/logo.png';

const App = () => {
    //Menu desplegable
    const tops = [polo1A, polo3A, poloabierto2A, polomangalarga1A, polomangalarga2A, poncho1A];
    const selectTop = (index) => {}; // declara una función para seleccionar un top
    const bottoms = []; // declara un array de tops
    const selectBottom = (index) => {}; // declara una función para seleccionar un top
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (!event.target.closest('.left-menu')) {
          setSelectedMenuItem(null);
        }
      };
    
      document.addEventListener('click', handleOutsideClick);
    
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, []);

  // PANTALLA COMPLETA
    const [fullWindow, setFullWindow] = useState(false);

    const toggleFullscreen = () => {
      setFullWindow(!fullWindow);
    };
    
    const handleFullWindow = () => {
      setFullWindow(fullWindow);
    };
    

    useEffect(() => {
      document.getElementById('ventana-completa-btn').addEventListener('click', toggleFullscreen);
      return () => {
        document.getElementById('ventana-completa-btn').removeEventListener('click', toggleFullscreen);
      };
    }, [toggleFullscreen]);

    // CAMBIO DE AVATAR
    const [showAvatarList, setShowAvatarList] = useState(false);
    const avatars = [avatarImage1, avatarImage2, avatarImage3, avatarImage4, avatarImage5];
    const avatarImages = {
      0: avatarImage1,
      1: avatarImage2,
      2: avatarImage3,
      3: avatarImage4,
      4: avatarImage5,
    };
    

    const handleShowAvatarList = () => {
      setShowAvatarList(true);
    };

    const handleHideAvatarList = () => {
      setShowAvatarList(false);
    };

    const [selectedAvatar, setSelectedAvatar] = useState(0);

    const handleChangeAvatar = (index) => {
      setSelectedAvatar(index);
    };

    useEffect(() => {
      if (selectedAvatar !== 0) {
        handleHideAvatarList();
      }
    }, [selectedAvatar]);

    // DIBUJAR PUNTOS DE POSE
    const drawPose = (pose, scaleFactor, ctx) => {
      const keypoints = pose.keypoints;
      keypoints.forEach((keypoint) => {
        const x = keypoint.position.x * scaleFactor;
        const y = keypoint.position.y * scaleFactor;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI); //modificar tamaño
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; //modificar color
        ctx.fill();
      });
    };
    // CARRUSEL PARA LAS PRENDAS
    const polos = [polo1A, polo3A, poloabierto2A, polomangalarga1A, polomangalarga2A, poncho1A];
    const pantalones = [pantalon1, pantalon2, pantalon3];

    const poloCarouselImages = [polo1, polo3, poloabierto2, polomangalarga1, polomangalarga2, poncho1];
    const pantalonCarouselImages = [pantalon1, pantalon2, pantalon3];

    const [topIndex, setTopIndex] = useState(0);
    const [bottomIndex, setBottomIndex] = useState(0);

    const handleSwapTopsLeft = () => {
      setTopIndex((prevIndex) => (prevIndex - 1 + polos.length) % polos.length);
    };

    const handleSwapTopsRight = () => {
      setTopIndex((prevIndex) => (prevIndex + 1) % polos.length);
    };

    const handleSwapBottomsLeft = () => {
      setBottomIndex((prevIndex) => (prevIndex - 1 + pantalones.length) % pantalones.length);
    };

    const handleSwapBottomsRight = () => {
      setBottomIndex((prevIndex) => (prevIndex + 1) % pantalones.length);
    };

    const leftTop = poloCarouselImages[topIndex];
    const rightTop = poloCarouselImages[(topIndex + 1) % polos.length];
    const leftBottom = pantalonCarouselImages[bottomIndex];
    const rightBottom = pantalonCarouselImages[(bottomIndex + 1) % pantalones.length];

    // Referencia al canvas donde se dibujará la pose
    const canvasRef = useRef(null);

    // Estado para almacenar el modelo de detección de pose
    const [net, setNet] = useState(null);

    // Carga el modelo de detección de pose al inicializar el componente
    useEffect(() => {
      const loadPosenet = async () => {
        const net = await posenet.load();
        setNet(net);
      };

      loadPosenet();
    }, []);

    // Detecta la pose en la imagen seleccionada cuando cambia 'net' o 'selectedAvatar'
    useEffect(() => {
      const detectPose = async () => {
        if (net) {
          const img = new Image(); // Crea una nueva imagen y la carga desde la URL seleccionada
          img.src = avatarImages[selectedAvatar];
          img.onload = async () => {
            const scaleFactor = Math.min(canvasRef.current.width / img.width, canvasRef.current.height / img.height);
            const pose = await net.estimateSinglePose(img, {
              flipHorizontal: false,
              scaleFactor: scaleFactor,
            });
            draw(pose, scaleFactor);
          };
        }
      };

      // Función para dibujar la imagen de avatar y prendas sobre un canvas utilizando la pose detectada
      const draw = (pose, scaleFactor) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Cargar la imagen del avatar seleccionado
        const img = new Image();
        img.src = avatarImages[selectedAvatar];
        img.onload = () => { // Calcular las dimensiones del avatar escalado
          const avatarWidth = img.width * scaleFactor;
          const avatarHeight = img.height * scaleFactor;
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de dibujar
          ctx.drawImage(img, 0, 0, avatarWidth, avatarHeight); // Dibujar la imagen del avatar escalada en el canvas

          // Cargar la imagen de los pantalones seleccionados
          const pantsImage = new Image();
          pantsImage.src = pantalones[bottomIndex];

          pantsImage.onload = () => { // Encontrar los keypoints relevantes para posicionar los pantalones
            const hips = pose.keypoints.find((point) => point.part === 'leftHip');
            const knees = pose.keypoints.find((point) => point.part === 'rightKnee');
            const rightAnkle = pose.keypoints.find((point) => point.part === 'rightAnkle');
            const leftKnee = pose.keypoints.find((point) => point.part === 'leftKnee');
            const ankles = pose.keypoints.find((point) => point.part === 'rightAnkle');

            if (!hips || !knees || !rightAnkle || !leftKnee || !ankles) return; // Verificar que todos los keypoints necesarios estén presentes

            // Calcular offset para posicionar el pantalon
            const offsetX = 25; // HORIZONTAL
            const offsetY = 90; // VERTICAL

            const pantsWidth = Math.abs(leftKnee.position.x - ankles.position.x) * scaleFactor;
            const pantsHeight = Math.abs(knees.position.y - hips.position.y) * scaleFactor * 2.4;

            const centerX = (leftHip.position.x + rightHip.position.x) / 2 * scaleFactor;
            const centerY = (leftHip.position.y + rightHip.position.y) / 2 * scaleFactor;

            const x = centerX - pantsWidth / 0.7 + offsetX;
            const y = centerY - pantsHeight / 2 + offsetY;

            // Función para dibujar los pantalones en el canvas
            const drawPants = (pantsImage, ctx, x, y, maxWidth, pantsHeight) => {
              // Definir funciones de dibujo para diferentes tipos de pantalones
              const pantsDrawingFunctions = {
                pantalon1: (ctx, pantsImage, x, y, maxWidth, pantsHeight) => {
                  ctx.drawImage(
                    pantsImage,
                    0, 0, pantsImage.width, pantsImage.height,
                    x - maxWidth / 0.55, y, maxWidth / 0.22, pantsHeight
                  );
                },
                pantalon2: (ctx, pantsImage, x, y, maxWidth, pantsHeight) => {
                  ctx.drawImage(
                    pantsImage,
                    0, 0, pantsImage.width, pantsImage.height,
                    x - maxWidth / 0.65, y, maxWidth / 0.22, pantsHeight
                  );
                },
                pantalon3: (ctx, pantsImage, x, y, maxWidth, pantsHeight) => {
                  ctx.drawImage(
                    pantsImage,
                    0, -15, pantsImage.width, pantsImage.height,
                    x - maxWidth / 0.73, y, maxWidth / 0.25, pantsHeight
                  );
                }
              };
              // Obtener la función de dibujo según el tipo de pantalón
              const drawFunction = pantsDrawingFunctions[pantsImage.src.split('/').pop().split('.')[0]];
              if (drawFunction) {
                drawFunction(ctx, pantsImage, x, y, maxWidth, pantsHeight);
              }
            };
            // Llamar a la función para dibujar los pantalones
            drawPants(pantsImage, ctx, x, y, pantsWidth, pantsHeight);
          };


          // Cargar la imagen de la camiseta seleccionada
          const shirtImage = new Image();
          shirtImage.src = polos[topIndex];
          // Dibujar prenda utilizando puntos de referencia
          const leftShoulder = pose.keypoints.find((point) => point.part === 'leftShoulder');
          const rightShoulder = pose.keypoints.find((point) => point.part === 'rightShoulder');
          const leftHip = pose.keypoints.find((point) => point.part === 'leftHip');
          const rightHip = pose.keypoints.find((point) => point.part === 'rightHip');
          const leftElbow = pose.keypoints.find((point) => point.part === 'leftElbow');
          const rightElbow = pose.keypoints.find((point) => point.part === 'rightElbow');

          if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftElbow || !rightElbow) return; // Verificar que todos los keypoints necesarios estén presentes

          // Calcular el offset en función de los puntos de referencia
          const offsetX = 0; // HORIZONTAL
          const offsetY = 22; // VERTICAL

          shirtImage.onload = () => {
            // Calcular ancho de la prenda basado en los codos
            const elbowDistance = Math.abs(leftElbow.position.x - rightElbow.position.x) * scaleFactor;
            const shoulderDistance = Math.abs(leftShoulder.position.x - rightShoulder.position.x) * scaleFactor;
            const hipDistance = Math.abs(leftHip.position.x - rightHip.position.x) * scaleFactor;

            // Determinar el ancho de la prenda basado en los puntos de los codos
            const maxWidth = Math.max(shoulderDistance, hipDistance, elbowDistance) * 1.75;

            // Calcular el alto de la prenda basado en la distancia vertical entre los hombros y las caderas
            const shirtHeight = Math.abs(leftShoulder.position.y - leftHip.position.y) * scaleFactor * 1.9;

            // Calcular el centro de la prenda
            const centerX = (leftShoulder.position.x + rightShoulder.position.x) / 2 * scaleFactor;
            const centerY = (leftShoulder.position.y + rightShoulder.position.y) / 1.5 * scaleFactor;

            // Calcular la posición para dibujar la prenda
            const x = centerX - maxWidth / 2 + offsetX;
            const y = centerY - shirtHeight / 1.87 + offsetY;

            const torsoX = x + (maxWidth / 2.9); // Centra el torso en el avatar

            // Función para dibujar la camiseta en el canvas
            const drawShirt = (shirtImage, ctx, x, y, maxWidth, shirtHeight) => { // Definir funciones de dibujo para diferentes tipos de camisetas
              const shirtDrawingFunctions = {
                polo1A: (ctx, shirtImage, x, y, maxWidth, shirtHeight) => {
                  const shirtHeightopcional = Math.abs(leftShoulder.position.y - leftHip.position.y) * scaleFactor * 1.75;
                  const torsoX = x + (maxWidth / 3.2);
                  const torsoWidth = shirtImage.width / 6.5;

                  ctx.drawImage(
                    shirtImage,
                    0, -20, shirtImage.width / 3, shirtImage.height,
                    x - maxWidth / 9, y, maxWidth / 2, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    shirtImage.width / 3, -25, shirtImage.width / 3, shirtImage.height,
                    torsoX, y, torsoWidth, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    (shirtImage.width / 3) * 2, -20, shirtImage.width / 3, shirtImage.height,
                    x + maxWidth / 1.6, y, maxWidth / 2, shirtHeightopcional
                  );
                },
                polo3A: (ctx, shirtImage, x, y, maxWidth, shirtHeight) => {
                  const torsoX = x + (maxWidth / 3.1);
                  const armWidth = shirtImage.width / 4;
                  const torsoWidth = shirtImage.width / 6.5;

                  ctx.drawImage(
                    shirtImage,
                    0, -9, shirtImage.width / 3, shirtImage.height,
                    x - maxWidth / 6.4, y, maxWidth / 2, shirtHeight
                  );

                  ctx.drawImage(
                    shirtImage,
                    shirtImage.width / 3, -10, shirtImage.width / 3, shirtImage.height,
                    torsoX, y, torsoWidth, shirtHeight
                  );

                  ctx.drawImage(
                    shirtImage,
                    (shirtImage.width / 3) * 2, -9, shirtImage.width / 3, shirtImage.height,
                    x + maxWidth / 1.52, y, maxWidth / 2, shirtHeight
                  );
                },
                poloabierto2A: (ctx, shirtImage, x, y, maxWidth, shirtHeight) => {
                  const shirtHeightopcional = Math.abs(leftShoulder.position.y - leftHip.position.y) * scaleFactor * 2.5;
                  const torsoX = x + (maxWidth / 3.9);
                  const torsoWidth = shirtImage.width / 18;

                  ctx.drawImage(
                    shirtImage,
                    0, 279, shirtImage.width / 3, shirtImage.height,
                    x - maxWidth / 7, y, maxWidth / 2.5, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    shirtImage.width / 3, 279, shirtImage.width / 3, shirtImage.height,
                    torsoX, y, torsoWidth, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    (shirtImage.width / 3) * 2, 279, shirtImage.width / 3, shirtImage.height,
                    x + maxWidth / 1.40, y, maxWidth / 2.3, shirtHeightopcional
                  );
                },

                polomangalarga1A: (ctx, shirtImage, x, y, maxWidth, shirtHeight) => {
                  const shirtHeightopcional = Math.abs(leftShoulder.position.y - leftHip.position.y) * scaleFactor * 1.55;
                  const torsoX = x + (maxWidth / 3.1);
                  const torsoWidth = shirtImage.width / 10;

                  ctx.drawImage(
                    shirtImage,
                    0, -97, shirtImage.width / 3, shirtImage.height,
                    x - maxWidth / 30, y, maxWidth / 2.5, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    shirtImage.width / 3, -100, shirtImage.width / 3, shirtImage.height,
                    torsoX, y, torsoWidth, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    (shirtImage.width / 3) * 2, -85, shirtImage.width / 3, shirtImage.height,
                    x + maxWidth / 1.7, y, maxWidth / 3, shirtHeightopcional
                  );
                },

                polomangalarga2A: (ctx, shirtImage, x, y, maxWidth, shirtHeight) => {
                  const shirtHeightopcional = Math.abs(leftShoulder.position.y - leftHip.position.y) * scaleFactor * 1.55;
                  const torsoX = x + (maxWidth / 3);
                  const torsoWidth = shirtImage.width / 19;

                  ctx.drawImage(
                    shirtImage,
                    0, -200, shirtImage.width / 3, shirtImage.height,
                    x - maxWidth / 6.5, y, maxWidth / 2, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    shirtImage.width / 3, -200, shirtImage.width / 3, shirtImage.height,
                    torsoX, y, torsoWidth, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    (shirtImage.width / 3) * 2, -200, shirtImage.width / 3, shirtImage.height,
                    x + maxWidth / 1.44, y, maxWidth / 2.5, shirtHeightopcional
                  );
                },

                poncho1A: (ctx, shirtImage, x, y, maxWidth, shirtHeight) => {
                  const shirtHeightopcional = Math.abs(leftShoulder.position.y - leftHip.position.y) * scaleFactor * 2.55;
                  const torsoX = x + (maxWidth / 3.18);
                  const torsoWidth = shirtImage.width / 30;

                  ctx.drawImage(
                    shirtImage,
                    0, 80, shirtImage.width / 3, shirtImage.height,
                    x - maxWidth / 2.3, y, maxWidth / 1.3, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    shirtImage.width / 3, 80, shirtImage.width / 3, shirtImage.height,
                    torsoX, y, torsoWidth, shirtHeightopcional
                  );

                  ctx.drawImage(
                    shirtImage,
                    (shirtImage.width / 3) * 2, 80, shirtImage.width / 3, shirtImage.height,
                    x + maxWidth / 1.4, y, maxWidth / 1.3, shirtHeightopcional
                  );
                }
              };
              // Obtener la función de dibujo según el tipo de camiseta
              const shirtName = polos[topIndex].split('/').pop().split('.')[0];
              if (shirtDrawingFunctions[shirtName]) {
                shirtDrawingFunctions[shirtName](ctx, shirtImage, x, y, maxWidth, shirtHeight);
              }
            };
            // Llamar a la función para dibujar la camiseta
            drawShirt(shirtImage, ctx, x, y, maxWidth, shirtHeight);
            // Llamar a la función para dibujar los puntos de pose
            drawPose(pose, scaleFactor, ctx);
          };          
        };
      };

      detectPose();
    }, [selectedAvatar, net, topIndex, bottomIndex]);

  return (
    <div>
      {fullWindow ? null : (
        <>
          <Header />
          <div className='menu'>
            <Menu logo={logo} />
          </div>
        </>
      )}
      <div className={`contenedor-principal ${fullWindow ? 'full-window-mode' : ''} ${selectedMenuItem === 'see-tops' ? 'left-menu-expanded' : ''}`}>
        <div className='submenu'>
          <Submenu />
        </div>
        <div className='contenedorapp'>
          <div className={`left-menu ${selectedMenuItem === 'see-tops' ? 'left-menu-expanded' : ''}`}>
            <div className="menu-item clickable" onClick={handleShowAvatarList}>
              Change Your Model
              {avatarImages && selectedAvatar !== null && (
                <img src={avatarImages[selectedAvatar]} alt="Current Avatar" className="avatar-image" />
              )}
            </div>
            <div className="menu-item clickable" onClick={() => setSelectedMenuItem('see-tops')}>
              Ver Tops
              <img src={leftTop} alt="Top Seleccionado" className='tops' />
            </div>
            <div className="menu-item clickable" onClick={() => setSelectedMenuItem('see-bottoms')}>
              Ver Fondos
              <img src={leftBottom} alt="Fondo Seleccionado" className='buttoms' />
            </div>
            <div className="menu-item">See Dresses
              <img src={polomangalarga1} alt="Selected Dresses" className="dresses" />
            </div>
            <div className="menu-item">See Jumpsuits</div>
            <div className="menu-item">others1</div>
            <div className="menu-item">others2</div>
          </div>
          {selectedMenuItem === 'change-model' && (
              <div className="avatar-list-overlay">
              </div>
            )}

            {selectedMenuItem === 'see-tops' && (
              <div className="tops-content">
              <h2>Tops</h2>
              <div>
                {tops.map((top, index) => (
                  <div key={index}>
                    <img src={top.image} alt={`Top ${index}`} />
                    <p>{top.name} descripcion de la prenda</p>
                    <button onClick={() => selectTop(index)}>Seleccionar</button>
                  </div>
                ))}
              </div>
            </div>
            )}

            {selectedMenuItem === 'see-bottoms' && (
              <div className="bottoms-content">
              <h2>Fondos</h2>
              <ul>
                {bottoms.map((bottom, index) => (
                  <li key={index}>
                    <img src={bottom.image} alt={`Fondo ${index}`} />
                    <p>{bottom.name}</p>
                    <button onClick={() => selectBottom(index)}>Seleccionar</button>
                  </li>
                ))}
              </ul>
            </div>
            )}
          {showAvatarList && (
            <div className="avatar-list-overlay">
              <h2 className='text-changeavatar'>Change Your Model</h2>
              <div className='contenedoravatares'>
                {avatars.map((avatar, index) => (
                  <div key={index} className='Avat'>
                    <img src={avatar} alt={`Avatar ${index + 1}`} />
                    <div className='infoandchange'>
                      <p>Descripción del avatar {index + 1}</p>
                      <button onClick={() => handleChangeAvatar(index)}>Select</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className='closelista'>
              <button className='clickable' onClick={handleHideAvatarList}>Close</button>
              </div>
            </div>
          )}
          <div className={`app ${selectedMenuItem === 'see-tops' ? 'left-menu-expanded' : ''}`}>
            <div className="fullwindow">
            <button type="button" className='clickable' id="ventana-completa-btn" onClick={handleFullWindow}>
              {fullWindow ? 'Salir de pantalla completa' : 'Ventana Completa'}
            </button>
            </div>
            <div className="options">
              <button type="button">Save Look</button>
            </div>
            <div className="izquierda">
              <Prenda1 key={leftTop} src={leftTop} alt="Prenda 1" className="prenda1" onClick={handleSwapTopsLeft} />
              <Prenda2 key={leftBottom} src={leftBottom} alt="Prenda 2" className="prenda2" onClick={handleSwapBottomsLeft} />
            </div>
            <div className="centro">
              <canvas ref={canvasRef} width="380" height="550"></canvas>
            </div>
            <div className="derecha">
              <Prenda3 key={rightTop} src={rightTop} alt="Prenda 3" className="prenda3" onClick={handleSwapTopsRight} />
              <Prenda4 key={rightBottom} src={rightBottom} alt="Prenda 4" className="prenda4" onClick={handleSwapBottomsRight} />
            </div>
            <div className="left-buttons">
              <button className="button" onClick={handleSwapTopsLeft}>&lt;</button>
              <button className="button" onClick={handleSwapBottomsLeft}>&lt;</button>
            </div>
            <div className="right-buttons">
              <button className="button" onClick={handleSwapTopsRight}>&gt;</button>
              <button className="button" onClick={handleSwapBottomsRight}>&gt;</button>
            </div>
          </div>
          <div className={`right-menu ${selectedMenuItem === 'see-tops' ? 'left-menu-expanded' : ''}`}>
            <div className="purchase-item">
              <div className='imageprenda'>
                <img src={leftTop} alt="Selected Top" />
              </div>
              <div className='infoprenda'>
                <div>Organic Linen Cotton Square Top</div>
                <div>$158.00</div>
                <button type="button">Add to Bag</button>
              </div>
            </div>
            <div className="purchase-item">
              <div className='imageprenda2'>
                <img src={leftBottom} alt="Selected Bottom" />
              </div>
              <div className='infoprenda'>
                <div>Shirom Black High-rise Skinny Jeans</div>
                <div>$198.00</div>
                <button type="button">Add to Bag</button>
              </div>
            </div>
            <div className="purchase-item">
              <div className='imageprenda3'>
                <img src={zapatos} alt="zapatos"/>
              </div>
              <div className='infoprenda'>
                <div>Shirom Black High-rise Skinny Jeans</div>
                <div>$198.00</div>
                <button type="button">Add to Bag</button>
              </div>
            </div>
            <div className="purchase-item">
              <div className='imageprenda3'>
                <img src={zapatos} alt="zapatos"/>
              </div>
              <div className='infoprenda'>
                <div>Shirom Black High-rise Skinny Jeans</div>
                <div>$198.00</div>
                <button type="button">Add to Bag</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
