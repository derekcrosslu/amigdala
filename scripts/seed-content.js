"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var uri = process.env.MONGODB_URI || '';
var dbName = process.env.MONGODB_DB || 'amigdala';
var content = [
    {
        section: 'about',
        heading: 'SOBRE MÍ',
        profileImage: '/sol.webp',
        paragraph1: 'Durante <b>casi 20 años</b> he acompañado a personas en su camino de desarrollo personal y profesional a través de las artes expresivas, construyendo puentes hacia el autoconocimiento y la transformación.',
        paragraph2: 'Mi recorrido incluye <b>más de 13 años</b> en la asociación cultural D1, mi casa y escuela, donde he desarrollado metodologías que conectan el arte con el crecimiento humano.',
        paragraph3: 'He tenido el privilegio de facilitar sesiones para una diversidad de espacios: desde empresas multinacionales hasta pequeños emprendimientos, desde docentes de colegios públicos hasta estudiantes universitarios, desde artistas consolidados hasta personas que apenas descubren su potencial creativo.',
        closingText: 'Ahora, después de acumular lo que siento como "un millón de horas de vuelo", estoy lista para expandir horizontes con <b>AMIGDALA</b>, mi consultora de arteterapia con enfoque humanista.',
        quote: 'Para que puedas abrir tu mundo, primero he abierto el mío',
        updatedAt: new Date(),
    },
    {
        section: 'services',
        heading: 'SERVICIOS',
        introduction: 'En AMIGDALA diseño experiencias personalizadas para cada espacio, momento y necesidad. Las artes expresivas se convierten en puentes hacia descubrimientos profundos y transformaciones significativas.',
        featuredImage: '/images/workshop-candle.jpeg',
        services: [
            {
                id: '1',
                title: 'Sesiones Individuales',
                description: 'Un espacio íntimo y seguro para explorar tu mundo interior a través de diferentes lenguajes artísticos. No se requiere experiencia previa en arte, solo apertura para descubrir.',
                additionalText: 'Ideal para momentos de transición, búsqueda personal o cuando necesitas claridad en tu camino.',
            },
            {
                id: '2',
                title: 'Talleres Grupales',
                description: 'Experiencias colectivas donde la creatividad compartida potencia el desarrollo personal. Grupos reducidos que permiten atención personalizada dentro de la dinámica colectiva.',
                additionalText: 'Perfectos para equipos de trabajo, grupos de amigos o comunidades que buscan fortalecer vínculos mientras exploran nuevas dimensiones de sí mismos.',
            },
            {
                id: '3',
                title: 'Consultorías Corporativas',
                description: 'Programas diseñados específicamente para organizaciones que buscan impulsar la creatividad, mejorar el clima laboral o facilitar procesos de cambio utilizando metodologías basadas en artes expresivas.',
                additionalText: 'Adaptables a diferentes duraciones, desde intervenciones puntuales hasta procesos de acompañamiento continuado.',
            },
            {
                id: '4',
                title: 'Formación para Educadores',
                description: 'Herramientas prácticas para docentes que desean incorporar las artes expresivas como vehículo de aprendizaje y desarrollo en sus espacios educativos.',
                additionalText: 'Basado en años de experiencia trabajando con instituciones educativas de diversos contextos.',
            },
        ],
        updatedAt: new Date(),
    },
    {
        section: 'experience',
        heading: 'MI EXPERIENCIA',
        image: '/images/circle-artwork.jpeg',
        leftText: 'Círculo de arte terapia',
        rightText: 'He dictado sesiones cortas y larguísimas a empresas gigantes, pequeñas, a docentes de colegios públicos, a estudiantes, universidades prestigiosas, a artistas, a colectivos, a personas de todas las edades y sabores... son tantos los espacios que llevo un millón de horas de vuelo.\n\nTengo una especial sensibilidad con la gente y ya estoy lista para atender en mi casa taller de manera individual o grupal como arteterapeuta con enfoque humanista.',
        updatedAt: new Date(),
    },
    {
        section: 'approach',
        heading: 'MI ENFOQUE',
        intro: 'Como arteterapeuta con <b>enfoque humanista</b>, creo firmemente en el potencial innato de cada persona para su auto-realización y crecimiento. Mi trabajo se basa en tres principios fundamentales:',
        principles: [
            {
                number: 1,
                title: 'El arte como lenguaje universal',
                description: 'Las expresiones artísticas nos permiten comunicar aquello que las palabras no siempre alcanzan a nombrar. A través del color, el movimiento, la forma o el sonido podemos dar voz a nuestras experiencias más profundas.',
            },
            {
                number: 2,
                title: 'La persona como centro',
                description: 'Cada individuo es único, con su propio ritmo y manera de construir significados. Mi rol es acompañar, no dirigir, creando un espacio seguro donde cada uno pueda explorar su mundo interior con libertad y sin juicios.',
            },
            {
                number: 3,
                title: 'El proceso sobre el resultado',
                description: 'En arteterapia valoramos el camino creativo más que el producto final. No buscamos crear "obras de arte" según estándares externos, sino facilitar experiencias significativas donde el proceso de creación sea en sí mismo transformador.',
            },
        ],
        closing: 'Mi formación multidisciplinaria y los años de experiencia me han permitido desarrollar una metodología flexible, capaz de adaptarse a diferentes contextos y necesidades, siempre manteniendo como norte el bienestar y desarrollo integral de las personas.',
        updatedAt: new Date(),
    },
    {
        section: 'contact',
        heading: 'CONTÁCTAME',
        lines: [
            '¡Es hora de abrirme al mundo! -para que puedas abrir el tuyo-',
            'Diseñaré experiencias para cada espacio, momento y lugar, con tarifas que dependerán de lo que se desee explorar.',
            'Sólo escríbeme al interno mientras construyo la web.',
            '¿Sabes qué significa web? Malla, red, entramado: esa ya la tengo hace tieeeempo 😊',
        ],
        contactInfo: {
            email: 'correo@amigdala.org',
            phone: '+51997244742',
            linkedin: 'Perfil LinkedIn de Sol',
        },
        closing: 'Gracias por compartir y por confiar en mí, que de eso estoy MUY segura.',
        signature: 'Sol',
        updatedAt: new Date(),
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new mongodb_1.MongoClient(uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 5, 7]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    db = client.db(dbName);
                    collection = db.collection('content');
                    return [4 /*yield*/, collection.deleteMany({})];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, collection.insertMany(content)];
                case 4:
                    _a.sent();
                    console.log('Seeded content successfully!');
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.close()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
