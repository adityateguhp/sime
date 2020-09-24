import Organization from '../models/Organization'
import Event from '../models/Event';
import Project from '../models/Project';
import Department from '../models/Department';
import Position from '../models/Position';
import Staff from '../models/Staff';
import Comitee from '../models/Comitee';
import Division from '../models/Division';
import External from '../models/External';
import ExternalType from '../models/ExternalType';
import Rundown from '../models/Rundown';
import Roadmap from '../models/Roadmap';
import Task from '../models/Task';

export const ORGANIZATIONS = [
    new Organization(
        'o1',
        'Fakultas Ilmu Komputer Universitas Brawijaya',
        'Refers to SK Dikti No.163/KEP/DIKTI/2007 about ‘Arrangement and Codification of Programme’ and and SK Rektor UB No. 516/SK/2011, Program of Information Technology and Computer Science (PTIIK) was first established on October 27th, 2011. PTIIK is a combination of two programme in Brawijaya University (UB). They are Software Engineering Programme under Faculty of Engineering and Computer Science Programme under Faculty of Science. Both of these programmes have similarities and suitability in core of disciplinary knowledge. On December 10th, 2014 PTIIK officially become a faculty named Faculty of Computer Science (FILKOM) based on SK Dikti No. 8073/EI/OT/2014 about Organization and Work Procedure of Brawijaya University.',
        'filkom@ub.ac.id',
        '12345678',
        'https://media-exp1.licdn.com/dms/image/C4E0BAQG-FO7nOawetA/company-logo_200_200/0?e=2159024400&v=beta&t=fuuDA0lUgEqIfSw7FIIiayJPFhO7SsTVl9Obyvk8Zx4'
    )
]

export const DEPARTMENTS = [
    new Department(
        'd1',
        'Kemahasiswaan',
        'o1'
    ),
    new Department(
        'd2',
        'Hubungan Masyarakat',
        'o1'
    ),
    new Department(
        'd3',
        'Keilmuan',
        'o1'
    )
];


export const STAFFS = [
    new Staff(
        's1',
        'Soleh Solihun',
        'Head',
        'd1',
        'soleh@gmail.com',
        '08123456789',
        '12345678',
        'https://cdn-image.bisnis.com/posts/2018/01/04/723525/soleh-solihun-ist.jpg'
    ),
    new Staff(
        's2',
        'Ari Lasso',
        'Staff',
        'd1',
        'ari@gmail.com',
        '08987654321',
        '12345678',
        'https://cdn0-production-images-kly.akamaized.net/99O7SRWeGwedNluoMeH36JEJWjQ=/0x374:1280x1095/640x360/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/2387423/original/057422400_1539922530-Ari_Lasso__4_.jpg'
    ),
    new Staff(
        's3',
        'Ahman Dhani',
        'Staff',
        'd1',
        'ahmad@gmail.com',
        '08123456564',
        '12345678',
        'https://img.discogs.com/5hPPxmLu2qv7MiqUfgQuKdCCy08=/511x512/smart/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/A-3556573-1452287283-6542.jpeg.jpg'
    ),
    new Staff(
        's4',
        'Raditya Dika',
        'Head',
        'd2',
        'raditya@gmail.com',
        '08123451234',
        '12345678',
        'https://yt3.ggpht.com/a/AATXAJwpn9P7c0AC11STOhMlUHeg06JzGeBeo7CZcQ=s900-c-k-c0xffffffff-no-rj-mo'
    ),
    new Staff(
        's5',
        'Aditya Teguh Pratama',
        'Head',
        'd3',
        'aditya@gmail.com',
        '08123456708',
        '12345678',
        'https://lh3.googleusercontent.com/-nFLznxwvECw/XDbvuavBXOI/AAAAAAAAAOI/BpgT2MEkZLseRS-GNGFUxFszBWyy0CcUwCEwYBhgLKs4DAL1OcqxVMTqE1Feerht7AG5NUFibSYUpSWn9AtIeO4hX_7PpQi1y2zH_fACdnw0BUODR3SoVzBZqauAZs5WyOA-Wu-HTd60bPbdScFl-fppP4JQ9Z-a_a1L4CuOeG6sIECjaDDsPCtOwBJNlmYfxnslPP2hfriwCJCESX_mb1RzXU1dHYMd9sqjZWMMI4G-UTpxMmB7iXWl1GMz83LnxIoGQeBEys9jh2Vg1snWeORPQdXG5BxqSaOpygKEvsdPrtIMNZKa9BtKpkO_hN1zCzubkHPxPa26DJK0KxvQb6xfNd96NJQlbdI20VGDfrpV9IjF2S4SKZh8nlW2igTpkKyx9aAhQsQryb8DThmMKOrS2TVujzZN-v34FSJVMs5JG1SOV8z_Ws755icTpBImu7K9XdUp9b6ItqY8vw2MC-95r2I6P4YRxz3Y5mnVIXbpRhZ19D57joGvjQrIeKP1EnWi3qfCopwT-VAdoSrj5IrYa4vVOYqcKvVkzgqCpIZVKNOCcDxGe04e5nZlilh6yRs152pmtXmTx-_lbJanvWAHRBtbW00JvrupGBHt6xlXiC9ZzF0tJ0RneCjY9lo-zF6HpIsRk8VMK6_LrjyENMMjml_YF/w139-h140-p/ORG_DSC08399.png'
    ),
];

export const PROJECTS = [
    new Project(
        'p1',
        'FILKOM Anniversary 2020',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        false,
        '2020-02-12',
        '2020-04-13',
        'o1',
        'https://scontent.fcgk18-2.fna.fbcdn.net/v/t1.0-9/20621875_1226218907482553_477011060750461870_n.jpg?_nc_cat=102&_nc_sid=8bfeb9&_nc_eui2=AeFGznGudWj9MJCYVo6BiMLnOeFgZ0-AdwA54WBnT4B3AAUv-CrWzLWOSAmQHv0W4az6J7LZCdiNHpMfWHf90swL&_nc_oc=AQkymVb0UVmn6FV1q4WuawlFV-jK7A3UslP6i0Dy9u3nmUaSnPOVsayh3bcuajEL5fY&_nc_ht=scontent.fcgk18-2.fna&oh=d4230cf7870857b761b17b70d7d73eab&oe=5EEB7F70'
    ),
    new Project(
        'p2',
        'Music Freedom Day 2020',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        false,
        '2020-03-02',
        '2020-06-02',
        'o1',
        'https://freemuse.org/wp-content/uploads/2020/01/MFD2020-590x291.png'
    ),
    new Project(
        'p3',
        'Software Freedom Day 2020',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        false,
        '2020-06-24',
        '2020-11-24',
        'o1',
        'https://fedoramagazine.org/wp-content/uploads/2015/11/sfd2015-945x400.jpg'
    ),
    new Project(
        'p4',
        'PK2MABA FILKOM 2021',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        false,
        '2021-02-12',
        '2021-04-12',
        'o1',
        'https://file-filkom.ub.ac.id/fileupload/assets/upload/file/event/kegiatan/2019-08/LOGO_PK2MABA19.png'
    ),
    new Project(
        'p5',
        'TEDxUniversitasBrawijaya',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        false,
        '2021-01-01',
        '2021-07-30',
        'o1',
        'https://tedxuniversitasbrawijaya.com/img/tedx_hitam.png'
    )
];

export const EVENTS = [
    new Event(
        'e1',
        'Fun Bike',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lapangan UB',
        false,
        '2020-04-10',
        '2020-04-10',
        'p1',
        'https://kotamobagu.online/wp-content/uploads/2020/02/Ilustrasi-Fun-Bike-528x430.jpg'
    ),
    new Event(
        'e2',
        'Workshop Filkom',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Gedung F Lantai 12',
        false,
        '2020-04-11',
        '2020-04-12',
        'p1',
        'https://pbs.twimg.com/media/EFs31_yVAAE7hWT.jpg'
    ),
    new Event(
        'e3',
        'Pentas Seni FILKOM',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lapangan Parkir Filkom',
        false,
        '2020-04-13',
        '2020-04-13',
        'p1',
        'https://fdn.gsmarena.com/imgroot/news/20/04/apple-music-covid-relief/-1220x526/gsmarena_001.jpg'
    ),
    new Event(
        'e4',
        'Music Festival',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Lapangan Krida',
        false,
        '2020-06-01',
        '2020-06-02',
        'p2',
        'https://yt3.ggpht.com/-rk1ZK5MQ0Egwvt2d2oH_oxuDnk8gUcd08pSNsZCIhuFGV21dzkm4q_BciHSsrkohKYMVI5Zyg=s900-c-k-c0xffffffff-no-rj-mo'
    ),
    new Event(
        'e5',
        'Workshop Linux',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Gazebo Filkom',
        false,
        '2020-10-20',
        '2020-10-23',
        'p3',
        'https://www.dewaweb.com/blog/wp-content/uploads/2019/08/logo-linux-255x300.png'
    )
];

export const DIVISIONS = [
    new Division(
        'div1',
        'Core Comitee',
        '5f563332c08d245a4874f21e'
    ),
    new Division(
        'div2',
        'Perlengkapan',
        'p1'
    ),
    new Division(
        'div3',
        'Sponsorship',
        'p1'
    ),
    new Division(
        'div4',
        'Acara',
        'p1'
    ),
    new Division(
        'div5',
        'Design dan Media',
        'p1'
    ),
    new Division(
        'div6',
        'Core Comitee',
        'p2'
    ),
    new Division(
        'div7',
        'Perlengkapan',
        'p2'
    ),
    new Division(
        'div8',
        'Design dan Media',
        'p2'
    ),
    new Division(
        'div9',
        'Core Comitee',
        'p3'
    ),
    new Division(
        'div10',
        'Core Comitee',
        'p4'
    ),
    new Division(
        'div11',
        'Core Comitee',
        'p5'
    )
];

export const POSITIONS = [
    new Position(
        'pos1',
        'Head of Project',
        true
    ),
    new Position(
        'pos2',
        'Vice Head of Project',
        true
    ),
    new Position(
        'pos3',
        'Secretary',
        true
    ),
    new Position(
        'pos4',
        'Treasurer',
        true
    ),
    new Position(
        'pos5',
        'Head of Division',
        false
    ),
    new Position(
        'pos6',
        'Vice Head of Division',
        false
    ),
    new Position(
        'pos7',
        'Staff of Division',
        false
    )
];

export const COMITEES = [
    new Comitee(
        'c1',
        's1',
        'pos1',
        'div1',
        'p1'
    ),
    new Comitee(
        'c2',
        's2',
        'pos2',
        'div1',
        'p1'
    ),
    new Comitee(
        'c3',
        's3',
        'pos3',
        'div1',
        'p1'
    ),
    new Comitee(
        'c4',
        's4',
        'pos4',
        'div1',
        'p1'
    ),
    new Comitee(
        'c5',
        's5',
        'pos5',
        'div2',
        'p1'
    ),
    new Comitee(
        'c6',
        's2',
        'pos1',
        'div6',
        'p2'
    ),
    new Comitee(
        'c7',
        's1',
        'pos2',
        'div6',
        'p2'
    ),
    new Comitee(
        'c8',
        's3',
        'pos5',
        'div7',
        'p2'
    ),
    new Comitee(
        'c9',
        's4',
        'pos6',
        'div7',
        'p2'
    ),
    new Comitee(
        'c10',
        's5',
        'pos7',
        'div7',
        'p2'
    ),
    new Comitee(
        'c11',
        's3',
        'pos1',
        'div9',
        'p3'
    ),
    new Comitee(
        'c12',
        's4',
        'pos1',
        'div10',
        'p4'
    ),
    new Comitee(
        'c13',
        's5',
        'pos1',
        'div11',
        'p5'
    )
];

export const EXTERNALTYPES = [
    new ExternalType(
        'et1',
        'Guests'
    ),
    new ExternalType(
        'et2',
        'Sponsors'
    ),
    new ExternalType(
        'et3',
        'Media Partners'
    ),
    new ExternalType(
        'et4',
        'Volunteers'
    ),
];


export const EXTERNALS = [
    new External(
        'spon1',
        'Nestle',
        'et2',
        'nestle@food.id',
        '021786543',
        'Sponsor utama',
        'e1',
        'http://www.biru.or.id/wp-content/uploads/2019/12/nestle-logo.png'
    ),
    new External(
        'spon2',
        'Indofood',
        'et2',
        'indo@food.id',
        '021481143',
        'Sponsor kedua',
        'e1',
        'https://akcdn.detik.net.id/visual/2015/01/04/a2c5f53f-bf4b-4eff-9e4f-773e879068d8_169.jpg?w=650'
    ),
    new External(
        'spon3',
        'Telkomsel',
        'et2',
        'telkom@cell.id',
        '021685243',
        'Sponsor ketiga',
        'e1',
        'https://pbs.twimg.com/profile_images/975350015064354816/hVH80E7s_400x400.jpg'
    ),
    new External(
        'spon4',
        'Nestle',
        'et2',
        'nestle@food.id',
        '021786543',
        'Sponsor utama',
        'e2',
        'http://www.biru.or.id/wp-content/uploads/2019/12/nestle-logo.png'
    ),
    new External(
        'spon5',
        'Nestle',
        'et2',
        'nestle@food.id',
        '021786543',
        'Sponsor utama',
        'e3',
        'http://www.biru.or.id/wp-content/uploads/2019/12/nestle-logo.png'
    ),
    new External(
        'spon6',
        'Samsung',
        'et2',
        'samsung@tech.id',
        '021231243',
        'Sponsor keempat',
        'e2',
        'https://www.designyourway.net/blog/wp-content/uploads/2019/10/s1-60.jpg'
    ),
    new External(
        'spon7',
        'Gopay',
        'et2',
        'gopay@fintech.id',
        '0214575221',
        'Sponsor kelima',
        'e3',
        'https://jatimplus.id/wp-content/uploads/2019/08/Gopay-Sponsor-Persik-New.png'
    ),
    new External(
        'g1',
        'Elon Musk',
        'et1',
        'elon@musk.id',
        '021535341',
        'Guest utama',
        'e1',
        'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg'
    ),
    new External(
        'g2',
        'Hideo Kojima',
        'et1',
        'hideo@kojima.id',
        '02334143',
        'Guest kedua',
        'e1',
        'https://cdn02.indozone.id/re/content/2019/09/09/3es03Q/t_5d75e1b1a2a1e.jpg?w=700&q=85'
    ),
    new External(
        'g3',
        'Benee',
        'et1',
        'benee@music.id',
        '021685243',
        'Guest ketiga',
        'e1',
        'https://fashionjournal.com.au/wp-content/uploads/2019/11/fashion-journal-benee-interview-mob11.jpg'
    ),
    new External(
        'g4',
        'Elon Musk',
        'et1',
        'elon@musk.id',
        '021535341',
        'Guest utama',
        'e2',
        'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg'
    ),
    new External(
        'g5',
        'Elon Musk',
        'et1',
        'elon@musk.id',
        '021535341',
        'Guest utama',
        'e3',
        'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg'
    ),
    new External(
        'g6',
        'Mardigu Wowiek Prasantyo',
        'et1',
        'mardigu@wowiek.id',
        '0213321243',
        'Guest keempat',
        'e2',
        'https://akcdn.detik.net.id/community/media/visual/2018/06/05/bb04507a-16cb-472d-8b5a-cbf5bfff4b6c.jpeg?a=1'
    ),
    new External(
        'g7',
        'Najwa Shihab',
        'et1',
        'najwa@shihab.id',
        '0216457221',
        'Guest kelima',
        'e3',
        'https://assets.pikiran-rakyat.com/crop/34x0:660x473/x/photo/2020/03/16/2520099398.jpg'
    ),
    new External(
        'v1',
        'Adnan Hairul',
        'et4',
        'adnan@hairul.id',
        '087616162233',
        'Volunteer Hari H',
        'e1',
        'https://www.ludoviccareme.com/files/image_211_image_fr.jpg'
    ),
    new External(
        'v2',
        'Bayu Kharisma',
        'et4',
        'bayu@kharisma.id',
        '087625255733',
        'Volunteer Hari H',
        'e1',
        'https://media-exp1.licdn.com/dms/image/C5103AQE-bGFAuucAnw/profile-displayphoto-shrink_200_200/0?e=1597276800&v=beta&t=EEw8MyI4O-ma6RZTvj9isDYSJ1Dha6vbqO_9-j0jYj0'
    ),
    new External(
        'v3',
        'Faesal Kharisma',
        'et4',
        'faesal@kharisma.id',
        '087444255733',
        'Volunteer Hari H',
        'e2',
        'https://www.rencontres-arles.com/files/artist_thumbnail_687.jpg'
    ),
    new External(
        'mp1',
        'infoub',
        'et3',
        'infoub@gmail.com',
        '087625211133',
        'share di ig',
        'e1',
        'https://pbs.twimg.com/profile_images/636532030717620224/p0FGhet3_400x400.jpg'
    ),
    new External(
        'mp2',
        'Radio Malang',
        'et3',
        'radiomalang@gmail.com',
        '087444002733',
        'broadcast di radio',
        'e2',
        'https://static-media.streema.com/media/cache/f8/5e/f85e1e7a9bed0c569732ba093dd7f1d1.jpg'
    )
];


export const RUNDOWNS = [
    new Rundown(
        'r1',
        'Pembukaan oleh ketua',
        'dilaksanakan di gedung 12',
        '2020-04-10',
        '2020-04-10T07:00:00',
        '2020-04-10T07:30:00',
        'e1'
    ),
    new Rundown(
        'r2',
        'Sambutan oleh rektor',
        'dilaksanakan di gedung 12',
        '2020-04-10',
        '2020-04-10T07:30:00',
        '2020-04-10T08:00:00',
        'e1'
    ),
    new Rundown(
        'r3',
        'Sepedahan keliling malang',
        'kota malang',
        '2020-04-10',
        '2020-04-10T08:00:00',
        '2020-04-10T12:00:00',
        'e1'
    ),
    new Rundown(
        'r4',
        'Pembagian doorprize',
        'dilaksanakan di lapangan',
        '2020-04-11',
        '2020-04-11T09:00:00',
        '2020-04-11T10:30:00',
        'e1'
    ),
    new Rundown(
        'r5',
        'Penutupan oleh ketua',
        'dilaksanakan di lapangan',
        '2020-04-11',
        '2020-04-11T10:30:00',
        '2020-04-11T11:00:00',
        'e1'
    )
]

export const ROADMAPS = [
    new Roadmap(
        'rm1',
        'Membuat proposal',
        '2020-01-10',
        '2020-01-12',
        '5f6248c6f3b86f109c5d9ca9'
    ),
    new Roadmap(
        'rm2',
        'Mencari sponsorhip',
        '2020-01-10',
        '2020-02-10',
        '5f6248c6f3b86f109c5d9ca9'
    ),
    new Roadmap(
        'rm3',
        'Membuat jersey',
        '2020-02-01',
        '2020-02-15',
        '5f6248c6f3b86f109c5d9ca9'
    ),
    new Roadmap(
        'rm4',
        'Membuat tiket',
        '2020-02-15',
        '2020-02-20',
        '5f6248c6f3b86f109c5d9ca9'
    ),
]

export const TASKS = [
    new Task(
        't1',
        'Mencari materi',
        'mencari materi untuk proposal',
        false,
        '2020-01-15',
        '5f58e9747f583754686b9741',
        'rm1',
        ''
    ),
    new Task(
        't2',
        'Membuat draft',
        'membuat draft untuk proposal',
        false,
        '2020-01-20',
        '5f58e9747f583754686b9741',
        'rm1',
        ''
    ),
    new Task(
        't3',
        'Membuat draft 2',
        'membuat draft 2 untuk proposal',
        false,
        '2020-01-30',
        '5f58e9747f583754686b9741',
        'rm1',
        ''
    ),
    new Task(
        't4',
        'Membuat draft 3',
        'membuat draft 3 untuk proposal',
        false,
        '2020-02-05',
        '5f58e9747f583754686b9741',
        'rm1',
        ''
    ),
]

