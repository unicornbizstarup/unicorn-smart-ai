export const WEALTH_ELEMENTS = {
    FIRE: {
        name: 'ธาตุไฟ (FIRE)',
        archetype: 'The Charismatic Leader',
        concept: 'รวดเร็ว ร้อนแรง ทรงพลัง',
        description: 'คุณคือผู้นำที่กล้าหาญ มีความกระตือรือร้นสูง และมีพลังในการสร้างแรงบันดาลใจให้ผู้อื่น',
        strengths: ['มีความเป็นผู้นำสูง', 'กล้าตัดสินใจ', 'มีพลังงานเหลือเฟือ', 'สื่อสารได้น่าตื่นเต้น'],
        weaknesses: ['ใจร้อนเกินไป', 'อาจมองข้ามรายละเอียดเล็กๆ', 'อารมณ์ขึ้นลงง่าย'],
        business_strategy: 'เน้นการทำตลาดแบบ STP (Fast Pace), การพูดบนเวที, และการสร้างผลผลิตที่รวดเร็ว (Quick Wins)',
        content_ideas: [
            'วิดีโอสร้างแรงบันดาลใจแบบ Impact',
            'คอนเทนต์โชว์ผลลัพธ์ความสำเร็จทันใจ',
            'Live สดที่เน้นพลังงานและการตัดสินใจ'
        ],
        recommended_products: ['DEEZE SHOT (Energy)', 'Unicorn Sky Air', 'Unicorn Smart Shapewear'],
        color: 'from-red-500 to-orange-500',
        icon: 'Zap'
    },
    WATER: {
        name: 'ธาตุน้ำ (WATER)',
        archetype: 'The Empathetic Connector',
        concept: 'ลื่นไหล เย็นสบาย ผูกพัน',
        description: 'คุณคือยอดนักสร้างสายสัมพันธ์ มีความเห็นอกเห็นใจสูง และสามารถปรับตัวเข้ากับทุกคนได้อย่างยอดเยี่ยม',
        strengths: ['ผู้ฟังที่ดีเยี่ยม', 'สร้างความเชื่อมั่นได้สูง', 'มีความอดทนสูง', 'ปรับตัวเก่ง'],
        weaknesses: ['ตัดสินใจช้า', 'เกรงใจคนอื่นมากเกินไป', 'อาจจะขาดความชัดเจนในบางครั้ง'],
        business_strategy: 'เน้นการดูแลสายสัมพันธ์ระยะยาว (Retention), การทำ House Meeting, และการ Coaching ใจทีมงาน',
        content_ideas: [
            'Storytelling เล่าเรื่องจากความประทับใจจริง',
            'คอนเทนต์ดูแลสุขภาพและการดูแลคนรอบตัว',
            'วิดีโอรีวิวสินค้าที่เน้นความนุ่มนวลและผลลัพธ์เชิงอารมณ์'
        ],
        recommended_products: ['UNI COLLA', 'U TENA (Eyes)', 'Personal Care Products'],
        color: 'from-blue-500 to-cyan-500',
        icon: 'Waves'
    },
    EARTH: {
        name: 'ธาตุดิน (EARTH)',
        archetype: 'The Reliable Foundation',
        concept: 'มั่นคง หนักแน่น จริงใจ',
        description: 'คุณคือผู้สร้างรากฐานที่แข็งแกร่ง มีระบบระเบียบสูง และเป็นที่พึ่งพาที่ได้รับความไว้วางใจที่สุด',
        strengths: ['มีความรับผิดชอบสูง', 'ทำงานเป็นระบบ', 'ละเอียดรอบคอบ', 'มีความสม่ำเสมอ'],
        weaknesses: ['เปลี่ยนแปลงยาก', 'อาจจะดูตึงเครียดเกินไป', 'ไม่ค่อยชอบความเสี่ยง'],
        business_strategy: 'เน้นการใช้ระบบ 456 อย่างเคร่งครัด, การวิเคราะห์แผนรายได้เชิงลึก, และการสร้างฐานผู้บริโภคที่ยั่งยืน',
        content_ideas: [
            'คอนเทนต์เจาะลึกส่วนประกอบสินค้า (Facts)',
            'การเปรียบเทียบแผนรายได้แบบเป็นตัวเลขชัดเจน',
            'คู่มือการทำธุรกิจแบบ Step-by-Step'
        ],
        recommended_products: ['BEETLE 7 OIL', 'MINA S (Weight)', 'Agriculture Products (U PLANT)'],
        color: 'from-amber-600 to-orange-800',
        icon: 'Shield'
    },
    AIR: {
        name: 'ธาตุลม (AIR)',
        archetype: 'The Creative Oracle',
        concept: 'อิสระ รวดเร็ว ทันสมัย',
        description: 'คุณคือนักคิดสร้างสรรค์ มีไอเดียบรรเจิด และก้าวทันเทคโนโลยีเสมอ',
        strengths: ['มีความคิดสร้างสรรค์สูง', 'เรียนรู้ไว', 'ชอบการติดต่อสื่อสาร', 'เก่งเรื่องออนไลน์'],
        weaknesses: ['สมาธิอาจจะหลุดง่าย', 'อาจจะเบื่อง่ายถ้างานซ้ำซาก', 'ทำหลายอย่างพร้อมกันจนไม่เสร็จสักอย่าง'],
        business_strategy: 'เน้นการใช้ Digital Marketing, Unicorn Smart AI, และการสร้างนวัตกรรมใหม่ๆ ในทีมงาน',
        content_ideas: [
            'วิดีโอสั้น TikTok ที่ทันสมัยและสนุกสนาน',
            'การใช้ AI ช่วยทำงานให้ดู Smart',
            'คอนเทนต์แนวไลฟ์สไตล์ (Digital Nomad)'
        ],
        recommended_products: ['24 FIN COFFEE', 'Gadgets', 'Innovation Products'],
        color: 'from-indigo-400 to-purple-500',
        icon: 'Airplay'
    }
};
