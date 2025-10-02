/* data.js - Pusat Data untuk Dapur Mercon Sultan */

const products = [
    { 
        id: 1, 
        name: 'Cumi Mercon', 
        price: 45000, 
        images: ['images/cumi-mercon.png', 'images/cumi-mercon-2.png', 'images/promo-1.webp'], 
        category: 'seafood', 
        isBestSeller: true, 
        stock: 4, 
        rating: 4.9, 
        reviews: 230, 
        description: 'Potongan cumi segar yang menari dalam ledakan sambal mercon otentik, diracik khusus untuk para Sultan. Dibuat dari cabai pilihan dan rempah rahasia, hidangan ini menjanjikan sensasi pedas yang nendang namun tetap nikmat.', 
        variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas', 'Extra Pedas'] }],
        specificReviews: [
            { author: 'Rina S.', rating: 5, text: 'Pedasnya mantap! Cuminya juga empuk, tidak alot sama sekali. Wajib coba level extra pedas.' },
            { author: 'Joko P.', rating: 4.5, text: 'Rasa bumbunya medok banget, khas. Pengiriman juga cepat. Pesan level pedas sudah cukup membuat keringetan.' },
            { author: 'Dewi L.', rating: 5, text: 'Ini cumi mercon terenak yang pernah saya coba. Bumbunya meresap sampai ke dalam. Akan pesan lagi pastinya.' }
        ]
    },
    { 
        id: 2, 
        name: 'Udang Mercon', 
        price: 50000, 
        images: ['images/udang-mercon-2.png', 'images/udang-mercon.png'], 
        category: 'seafood', 
        isBestSeller: true, 
        stock: 12, 
        rating: 4.7, 
        reviews: 90, 
        description: 'Udang segar pilihan, berpadu sempurna dengan sambal mercon khas kerajaan yang menggugah selera. Setiap gigitan memberikan rasa gurih udang yang manis berpadu dengan pedasnya sambal mercon.', 
        variants: [{ title: 'Level Pedas', options: ['Sedang', 'Pedas', 'Extra Pedas'] }],
        specificReviews: [
            { author: 'Agus T.', rating: 5, text: 'Udangnya fresh dan besar-besar. Sambalnya juara, pas banget dimakan sama nasi hangat.' },
            { author: 'Sinta M.', rating: 4, text: 'Enak, tapi buat saya yang gak terlalu kuat pedas, level sedang pun sudah cukup terasa. Next time mau coba yang non-pedas.' }
        ]
    },
    { 
        id: 3, 
        name: 'Dendeng Bakar', 
        price: 45000, 
        images: ['images/dendeng.png', 'images/footer-image.webp'], 
        category: 'non-pedas', 
        isBestSeller: true, 
        stock: 8, 
        rating: 4.6, 
        reviews: 40, 
        description: 'Dendeng sapi premium yang dibumbui rempah kaya rasa, lalu dibakar perlahan hingga empuk dan berkaramel. Aroma smokey yang khas membuatnya tak terlupakan.', 
        variants: [{ title: 'Level Pedas', options: ['Tidak Pedas', 'Sedang', 'Pedas'] }],
        specificReviews: [
            { author: 'Budi S.', rating: 5, text: 'Dendengnya empuk parah! Bumbu manis gurihnya pas, anak-anak di rumah juga suka yang varian tidak pedas.' }
        ]
    },
    { 
        id: 4, 
        name: 'Ayam Yakiniku', 
        price: 35000, 
        images: ['images/ayam-yakiniku.webp', 'images/about-us-bowl.webp'], 
        category: 'non-pedas', 
        isBestSeller: false, 
        stock: 15, 
        rating: 4.5, 
        reviews: 30, 
        description: 'Potongan ayam juicy dengan saus yakiniku khas Jepang yang manis dan gurih, cocok untuk semua kalangan. Disajikan dengan taburan wijen yang menambah aroma.', 
        variants: [],
        specificReviews: [
            { author: 'Cindy A.', rating: 4.5, text: 'Sausnya enak, ayamnya lembut. Porsinya juga pas. Jadi pilihan kalau lagi gak mau makan pedas.' },
             { author: 'Kevin H.', rating: 5, text: 'Rasa yakinikunya otentik, lebih enak dari beberapa resto jepang yang pernah saya coba. Mantap.' }
        ]
    }
];

const promoCodes = { 
    'SULTAN10': { type: 'percent', value: 10 }, 
    'MERCONGRATIS': { type: 'fixed', value: 15000 } 
};

const dummyNotifications = [
    { name: "Andi", location: "Jakarta Selatan", item: "Cumi Mercon 🦑" },
    { name: "Siti", location: "Bekasi", item: "Dendeng Bakar 🔥" },
    { name: "Budi", location: "Tangerang", item: "Ayam Yakiniku 🍗" },
    { name: "Dewi", location: "Jakarta Pusat", item: "Udang Mercon 🦐" },
    { name: "Eko", location: "Depok", item: "Cumi Mercon 🦑" },
    { name: "Fitri", location: "Jakarta Barat", item: "Dendeng Bakar 🔥" },
    { name: "Gilang", location: "Bogor", item: "Udang Mercon 🦐" },
    { name: "Hesti", location: "Jakarta Timur", item: "Ayam Yakiniku 🍗" },
    { name: "Indra", location: "Jakarta Utara", item: "Cumi Mercon 🦑" },
    { name: "Joko", location: "Bekasi", item: "Dendeng Bakar 🔥" },
    { name: "Kartika", location: "Tangerang", item: "Udang Mercon 🦐" },
    { name: "Lina", location: "Jakarta Selatan", item: "Ayam Yakiniku 🍗" },
    { name: "Mega", location: "Depok", item: "Cumi Mercon 🦑" },
    { name: "Nanda", location: "Bogor", item: "Dendeng Bakar 🔥" },
    { name: "Oscar", location: "Jakarta Pusat", item: "Udang Mercon 🦐" },
    { name: "Putri", location: "Jakarta Barat", item: "Ayam Yakiniku 🍗" },
    { name: "Rian", location: "Bekasi", item: "Cumi Mercon 🦑" },
    { name: "Sari", location: "Tangerang", item: "Dendeng Bakar 🔥" },
    { name: "Tono", location: "Jakarta Timur", item: "Udang Mercon 🦐" },
    { name: "Umar", location: "Jakarta Utara", item: "Ayam Yakiniku 🍗" }
];

const shippingOptions = { 
    '-- Pilih Area --': 0, 
    'Jakarta Pusat': 15000, 
    'Jakarta Selatan': 18000, 
    'Jakarta Barat': 17000, 
    'Jakarta Timur': 17000, 
    'Jakarta Utara': 20000, 
    'Bekasi': 23000, 
    'Tangerang': 22000, 
    'Depok': 25000 
};