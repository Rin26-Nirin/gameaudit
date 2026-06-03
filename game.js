// --- คลังโจทย์ใหญ่ 30 ข้อ แบ่งระดับความยากและไม่วนซ้ำซาก ---
const TRANSACTIONS_POOL = [
    // === LEVEL 1 - 2: ระดับง่าย (พื้นฐาน เงินสด รายได้ ค่าใช้จ่ายทั่วไป) ===
    { levelRange: [1, 2], text: "บิล: ขายบริการให้ลูกค้า ได้รับเงินสดทันที $500", type: "sale", amount: 500, correctDebit: "Cash", correctCredit: "Revenue", explanation: "ได้รับเงินสดทำให้สินทรัพย์ (Cash) เพิ่มขึ้นอยู่ฝั่ง Debit และมีรายได้เพิ่มขึ้นอยู่ฝั่ง Credit" },
    { levelRange: [1, 2], text: "ใบเสร็จ: จ่ายค่าเช่าออฟฟิศประจำเดือนนี้ด้วยเงินสด $200", type: "expense", amount: 200, correctDebit: "Rent Expense", correctCredit: "Cash", explanation: "การจ่ายค่าใช้จ่ายทำให้เกิด Rent Expense เพิ่มขึ้นฝั่ง Debit และทำให้เงินสดลดลงฝั่ง Credit" },
    { levelRange: [1, 2], text: "บิล: ซื้อสินค้าคงเหลือเข้าสต็อกเป็นเงินสด $120", type: "purchase", amount: 120, correctDebit: "Inventory", correctCredit: "Cash", explanation: "ซื้อของเข้าสต็อกทำให้สินทรัพย์เพิ่มขึ้น (Inventory) ฝั่ง Debit และเสียเงินสดลดลงฝั่ง Credit" },
    { levelRange: [1, 2], text: "ใบเสร็จ: จ่ายค่าไฟและค่าน้ำในออฟฟิศเป็นเงินสด $50", type: "expense", amount: 50, correctDebit: "Utilities Expense", correctCredit: "Cash", explanation: "จ่ายค่าสาธารณูปโภคทำให้เกิดค่าใช้จ่าย Utilities Expense เพิ่มฝั่ง Debit และเงินสดลดลงฝั่ง Credit" },
    { levelRange: [1, 2], text: "ใบเสร็จ: จ่ายเงินเดือนพนักงานประจำเดือนด้วยเงินสด $350", type: "expense", amount: 350, correctDebit: "Salary Expense", correctCredit: "Cash", explanation: "จ่ายเงินเดือนทำให้มีค่าใช้จ่าย (Salary Expense) เพิ่มฝั่ง Debit และทำให้เงินสดของกิจการลดลงฝั่ง Credit" },
    { levelRange: [1, 2], text: "บิล: ได้รับเงินสดจากค่าบริการออกแบบโลโก้ $400", type: "sale", amount: 400, correctDebit: "Cash", correctCredit: "Revenue", explanation: "การรับรายได้ค่าบริการเป็นเงินสด ทำให้เงินสดเพิ่มขึ้น (Debit) และรายได้เพิ่มขึ้น (Credit)" },
    { levelRange: [1, 2], text: "ใบเสร็จ: ซื้อกระดาษและหมึกพิมพ์สำนักงานเป็นเงินสด $60", type: "expense", amount: 60, correctDebit: "Utilities Expense", correctCredit: "Cash", explanation: "ค่าวัสดุสำนักงานเบ็ดเตล็ดบันทึกเป็นค่าใช้จ่ายหมวดบริหาร (Debit) คู่กับเงินสดที่ลดลงฝั่ง Credit" },
    { levelRange: [1, 2], text: "ใบเสร็จ: จ่ายค่าบริการอินเทอร์เน็ตของออฟฟิศ $45", type: "expense", amount: 45, correctDebit: "Utilities Expense", correctCredit: "Cash", explanation: "ค่าอินเทอร์เน็ตจัดเป็นค่าสาธารณูปโภคทำให้ค่าใช้จ่ายเพิ่มขึ้น (Debit) และเงินสดลดลง (Credit)" },
    { levelRange: [1, 2], text: "บิล: รับเงินค่าทำความสะอาดสต็อกออฟฟิศจากผู้เช่าร่วม $100", type: "sale", amount: 100, correctDebit: "Cash", correctCredit: "Revenue", explanation: "ได้รับเงินสดเพิ่มฝั่ง Debit คู่กับการรับรู้รายได้เบ็ดเตล็ดหรือรายได้อื่น ๆ ฝั่ง Credit" },
    { levelRange: [1, 2], text: "ใบเสร็จ: จ่ายเงินสดค่าซ่อมแซมประตูหน้าออฟฟิศที่พัง $130", type: "expense", amount: 130, correctDebit: "Rent Expense", correctCredit: "Cash", explanation: "ค่าซ่อมแซมทรัพย์สินจัดเป็นค่าใช้จ่ายในการดำเนินงานเพิ่มขึ้น (Debit) และจ่ายเงินสดลดลง (Credit)" },

    // === LEVEL 3 - 4: ระดับปานกลาง (เงินเชื่อ ลูกหนี้การค้า เจ้าหนี้การค้า และการถอนใช้ส่วนตัว) ===
    { levelRange: [3, 4], text: "บิล: ซื้อสินค้าเข้าสต็อก 'เป็นเงินเชื่อ' ยังไม่ได้ชำระเงิน $400", type: "purchase", amount: 400, correctDebit: "Inventory", correctCredit: "Accounts Payable", explanation: "ได้สินค้าเข้าคลัง สินทรัพย์เพิ่มขึ้น (Debit: Inventory) แต่ยังไม่ได้จ่ายเงิน จึงเกิดหนี้สินผูกพันขึ้นเรียกว่าเจ้าหนี้การค้า (Credit: Accounts Payable)" },
    { levelRange: [3, 4], text: "บิล: ส่งใบแจ้งหนี้เพื่อเก็บเงินลูกค้าสำหรับค่าบริการวางระบบ 'เป็นเงินเชื่อ' $700", type: "sale", amount: 700, correctDebit: "Accounts Receivable", correctCredit: "Revenue", explanation: "ให้บริการเสร็จแล้วรับรู้รายได้เพิ่มขึ้น (Credit: Revenue) ส่วนสิทธิในการรับเงินงวดหน้าจัดเป็นสินทรัพย์ชื่อลูกหนี้การค้า (Debit: Accounts Receivable)" },
    { levelRange: [3, 4], text: "ใบเสร็จ: จ่ายเงินสดชำระหนี้ให้แก่ 'เจ้าหนี้การค้า' ค้างเก่า $250", type: "expense", amount: 250, correctDebit: "Accounts Payable", correctCredit: "Cash", explanation: "การจ่ายหนี้ทำให้ภาระหนี้สินลดลง (Debit: Accounts Payable) และเสียเงินสดลดลงฝั่ง Credit" },
    { levelRange: [3, 4], text: "ใบเสร็จ: ได้รับเงินสดชำระหนี้จาก 'ลูกหนี้การค้า' ที่เคยติดเงินไว้ $300", type: "sale", amount: 300, correctDebit: "Cash", correctCredit: "Accounts Receivable", explanation: "ได้รับเงินสดทำให้สินทรัพย์เพิ่ม (Debit: Cash) และทำให้สิทธิการเป็นลูกหนี้สิ้นสุดลง สินทรัพย์ลูกหนี้ลดลง (Credit: Accounts Receivable)" },
    { levelRange: [3, 4], text: "เอกสาร: เจ้าของร้านถอนเงินสดจากบัญชีกิจการไปใช้จ่ายส่วนตัว $150", type: "expense", amount: 150, correctDebit: "Drawings", correctCredit: "Cash", explanation: "ถอนเงินใช้ส่วนตัวทำให้ส่วนของทุนลดลง บันทึกเข้าบัญชีถอนใช้ส่วนตัว (Debit: Drawings) และเงินสดลดลง (Credit: Cash)" },
    { levelRange: [3, 4], text: "บิล: จ้างบริษัทภายนอกมาทำโฆษณาเพจ 'เป็นเงินเชื่อ' ยังไม่ได้ชำระเงิน $180", type: "expense", amount: 180, correctDebit: "Advertising Expense", correctCredit: "Accounts Payable", explanation: "ค่าใช้จ่ายโฆษณาเกิดขึ้นแล้ว (Debit: Advertising Expense) แต่อตกลงจ่ายทีหลังจึงเกิดหนี้สินเจ้าหนี้การค้าเพิ่มขึ้น (Credit: Accounts Payable)" },
    { levelRange: [3, 4], text: "บิล: ซื้อชั้นวางของหมวดติดผนังมาใช้คลังสินค้า 'เป็นเงินเชื่อ' $220", type: "purchase", amount: 220, correctDebit: "Equipment", correctCredit: "Accounts Payable", explanation: "ชั้นวางของจัดเป็นอุปกรณ์สำนักงานสินทรัพย์เพิ่มขึ้น (Debit: Equipment) คู่กับหนี้สินเจ้าหนี้เพิ่มขึ้น (Credit: Accounts Payable)" },
    { levelRange: [3, 4], text: "ใบเสร็จ: ได้รับเงินสดเคลียร์หนี้บางส่วนจากลูกหนี้ค้างชำระ $120", type: "sale", amount: 120, correctDebit: "Cash", correctCredit: "Accounts Receivable", explanation: "เงินสดเพิ่มขึ้นอยู่ฝั่งเดบิต และหักลดสัดส่วนมูลค่าของลูกหนี้การค้าออกฝั่งเครดิต" },
    { levelRange: [3, 4], text: "ใบเสร็จ: กิจการโอนจ่ายเงินสดล้างหนี้ค่าวัสดุให้เจ้าหนี้การค้า $310", type: "expense", amount: 310, correctDebit: "Accounts Payable", correctCredit: "Cash", explanation: "หนี้สินลดลงบันทึกฝั่งเดบิต (Accounts Payable) และสินทรัพย์เงินสดลดลงบันทึกฝั่งเครดิต" },
    { levelRange: [3, 4], text: "เอกสาร: กิจการโอนสินค้าร้านค้าไปให้เจ้าของใช้เป็นการส่วนตัว $90", type: "expense", amount: 90, correctDebit: "Drawings", correctCredit: "Inventory", explanation: "ถอนใช้ส่วนตัวเพิ่มขึ้นฝั่งเดบิต (Drawings) แต่งวดนี้ถอนเป็นตัวสินค้า สินค้าคงเหลือจึงลดลงฝั่งเครดิต (Inventory)" },

    // === LEVEL 5 ขึ้นไป: ระดับแอดวานซ์ (ปรับปรุงสิ้นงวด สินทรัพย์ถาวร รายได้รับล่วงหน้า) ===
    { levelRange: [5, 99], text: "บิล: ซื้อคอมพิวเตอร์และเซิร์ฟเวอร์สำนักงานตัวใหม่เป็นเงินสด $800", type: "purchase", amount: 800, correctDebit: "Equipment", correctCredit: "Cash", explanation: "คอมพิวเตอร์เป็นสินทรัพย์ถาวรยาวนาน บันทึกเข้าบัญชีอุปกรณ์สำนักงาน (Debit: Equipment) และจ่ายเงินสดลดลง (Credit: Cash)" },
    { levelRange: [5, 99], text: "ใบเสร็จ: ได้รับเงินสดค่าบริการดูแลระบบล่วงหน้า 3 เดือนจากลูกค้า โดยที่กิจการยังไม่ได้เริ่มทำงานให้ $600", type: "sale", amount: 600, correctDebit: "Cash", correctCredit: "Unearned Revenue", explanation: "ได้รับเงินสดล่วงหน้า สินทรัพย์เพิ่ม (Debit: Cash) แต่ยังมีภาระต้องทำงานชดใช้ในอนาคต ถือเป็นหนี้สินชื่อ รายได้รับล่วงหน้า (Credit: Unearned Revenue)" },
    { levelRange: [5, 99], text: "ใบแจ้งหนี้: ได้รับบิลค่าที่ปรึกษากฎหมายประจำเดือนนี้แล้ว แต่ตกลงค้างจ่ายไว้ก่อน $200", type: "expense", amount: 200, correctDebit: "Rent Expense", correctCredit: "Accrued Expenses", explanation: "ค่าใช้จ่ายทางกฎหมายถือเป็นค่าใช้จ่ายดำเนินงานรับรู้ทันที (Debit) คู่กับบัญชีหนี้สินปรับปรุงคือ ค่าใช้จ่ายค้างจ่าย (Credit: Accrued Expenses)" },
    { levelRange: [5, 99], text: "บันทึกภายใน: ปรับปรุงบัญชีสิ้นเดือน คิดค่าเสื่อมราคาอุปกรณ์สำนักงานประจำงวด $70", type: "expense", amount: 70, correctDebit: "Depreciation Expense", correctCredit: "Accumulated Depreciation", explanation: "รับรู้มูลค่าเสื่อมเป็นค่าใช้จ่ายประจำงวด (Debit: Depreciation Expense) คู่กับบัญชีสินทรัพย์ปรับลดสะสม (Credit: Accumulated Depreciation)" },
    { levelRange: [5, 99], text: "ใบเสร็จ: จ่ายเงินสดค่าเบี้ยประกันภัยออฟฟิศล่วงหน้าสำหรับระยะเวลา 1 ปีเต็ม $360", type: "purchase", amount: 360, correctDebit: "Prepaid Insurance", correctCredit: "Cash", explanation: "การจ่ายเงินเพื่อรับความคุ้มครองอนาคต ถือเป็นสินทรัพย์หมุนเวียนชื่อ ค่าประกันภัยจ่ายล่วงหน้า (Debit: Prepaid Insurance) และเงินสดลดลง (Credit: Cash)" },
    { levelRange: [5, 99], text: "บิล: ซื้อโต๊ะเก้าอี้และเครื่องใช้สำนักงานตัวใหม่เพิ่มเป็นเงินเชื่อ $450", type: "purchase", amount: 450, correctDebit: "Equipment", correctCredit: "Accounts Payable", explanation: "ได้สินทรัพย์ถาวรเพิ่มขึ้นหมวดอุปกรณ์สำนักงาน (Debit: Equipment) คู่กับภาระหนี้สินเจ้าหนี้การค้าเพิ่มฝั่งเครดิต" },
    { levelRange: [5, 99], text: "บันทึกภายใน: สิ้นเดือนสแกนบิล พบว่ามีวัสดุสิ้นเปลืองที่ใช้ไปในระหว่างเดือนคิดเป็นมูลค่า $40", type: "expense", amount: 40, correctDebit: "Utilities Expense", correctCredit: "Inventory", explanation: "รับรู้ส่วนที่ใช้หมดไปเป็นค่าใช้จ่ายฝั่งเดบิต และตัดยอดออกจากบัญชีวัสดุหรือสินค้าคงคลังฝั่งเครดิต" },
    { levelRange: [5, 99], text: "ใบแจ้งหนี้: ค่าเช่าเครื่องถ่ายเอกสารประจำเดือนแจ้งมาแล้ว แต่ยอดจะตัดจ่ายสัปดาห์หน้า $110", type: "expense", amount: 110, correctDebit: "Rent Expense", correctCredit: "Accrued Expenses", explanation: "ค่าเช่าอุปกรณ์เกิดขึ้นแล้วฝั่งเดบิต (Rent Expense) คู่กับตั้งค้างจ่ายหนี้สินไว้ฝั่งเครดิต (Accrued Expenses)" },
    { levelRange: [5, 99], text: "เอกสาร: ทำการปรับปรุงรายได้รับล่วงหน้าเมื่อต้นเดือน บัดนี้ได้ทำงานให้ลูกค้าเสร็จสิ้นสมบูรณ์แล้ว $300", type: "sale", amount: 300, correctDebit: "Unearned Revenue", correctCredit: "Revenue", explanation: "เมื่อปฏิบัติตามภาระผูกพันเสร็จ ล้างหนี้สินรับล่วงหน้าออกฝั่งเดบิต (Unearned Revenue) และเปลี่ยนเป็นรายได้จริงฝั่งเครดิต (Revenue)" },
    { levelRange: [5, 99], text: "บันทึกภายใน: คิดค่าเสื่อมราคารถขนส่งสินค้าของกิจการประจำเดือน $150", type: "expense", amount: 150, correctDebit: "Depreciation Expense", correctCredit: "Accumulated Depreciation", explanation: "บันทึกค่าใช้จ่ายเสื่อมราคาฝั่งเดบิต คู่กับค่าเสื่อมราคาสะสมฝั่งเครดิตเพื่อเตรียมไปหักมูลค่าสินทรัพย์" }
];

const OPTIONS = [
    "Cash", "Revenue", "Inventory", "Rent Expense", "Utilities Expense", "Salary Expense",
    "Accounts Payable", "Accounts Receivable", "Drawings", "Equipment", "Unearned Revenue", 
    "Advertising Expense", "Accrued Expenses", "Depreciation Expense", "Accumulated Depreciation", "Prepaid Insurance"
];

const ACCOUNT_CATEGORIES = {
    assets: ["Cash", "Inventory", "Accounts Receivable", "Equipment", "Prepaid Insurance", "Accumulated Depreciation"],
    liabs: ["Accounts Payable", "Accrued Expenses", "Unearned Revenue", "Drawings"],
    exp: ["Revenue", "Rent Expense", "Utilities Expense", "Salary Expense", "Advertising Expense", "Depreciation Expense"]
};

// --- ระบบเสียงเรโทร ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.04);
    } else if (type === 'success') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.06);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'achievement') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); 
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); 
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.24); 
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'printer') {
        let now = audioCtx.currentTime;
        for (let i = 0; i < 8; i++) {
            let itemOsc = audioCtx.createOscillator();
            let itemGain = audioCtx.createGain();
            itemOsc.connect(itemGain); itemGain.connect(audioCtx.destination);
            itemOsc.type = 'sawtooth';
            itemOsc.frequency.setValueAtTime(i % 2 === 0 ? 240 : 160, now + (i * 0.06));
            itemGain.gain.setValueAtTime(0.04, now + (i * 0.06));
            itemGain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.06) + 0.04);
            itemOsc.start(now + (i * 0.06)); itemOsc.stop(now + (i * 0.06) + 0.04);
        }
    } else if (type === 'meow') {
        // *** 🐱 สังเคราะห์คลื่นเสียงร้อง เหมียววว~ สไตล์พิกเซลเกม 8-Bit ***
        let now = audioCtx.currentTime;
        osc.type = 'triangle';
        // การสไลด์คีย์เสียงจากต่ำขึ้นไปสูงอย่างรวดเร็ว (Frequency Ramp)
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
    }
}

const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const cash = ref(1000); const inventory = ref(500); const equipment = ref(0);
        const revenue = ref(0); const expenses = ref(0); const liabilities = ref(0);

        const actualCash = ref(1000); const actualInventory = ref(500); const actualEquipment = ref(0);
        const actualLiabilities = ref(0); const actualRevenue = ref(0); const actualExpenses = ref(0);

        const level = ref(1); const xp = ref(0); const streak = ref(0);
        const ledgerEntries = ref([]); const journalEntries = ref([]);
        
        const currentTx = ref({}); const selectedDebit = ref(null); const selectedCredit = ref(null);
        const feedback = ref(null); const showSummary = ref(false);
        const currentTaskNumber = ref(1); const dayAudits = ref([]); const correctCount = ref(0);
        const actualTotalAssets = ref(1500);
        let usedQuestionsInDay = [];

        const currentDebitTab = ref('assets');
        const currentCreditTab = ref('assets');

        // *** บรรจุตัวแปรคุมสถานะพฤติกรรมของน้องแมวส้ม ***
        const catState = ref('sleeping'); // sleeping, shocked, active

        const achievements = ref([
            { id: 'streak_5', title: '🏅 บันทึกมือโปร (Streak x5)', icon: '⚡', unlocked: false },
            { id: 'perfect_day', title: '📈 งบดุลไร้รอยต่อ (เต็ม 4/4)', icon: '💯', unlocked: false },
            { id: 'senior_auditor', title: '🎓 เซนียร์ออดิเตอร์ (LV.5)', icon: '🔮', unlocked: false },
            { id: 'cash_king', title: '💰 มหาเศรษฐีกิจการ ($2K+)', icon: '👑', unlocked: false }
        ]);

        const filteredDebitOptions = computed(() => ACCOUNT_CATEGORIES[currentDebitTab.value]);
        const filteredCreditOptions = computed(() => ACCOUNT_CATEGORIES[currentCreditTab.value]);

        const getNewQuestion = () => {
            const currentLevel = level.value;
            let availableQuestions = TRANSACTIONS_POOL.filter(q => currentLevel >= q.levelRange[0] && currentLevel <= q.levelRange[1]);
            availableQuestions = availableQuestions.filter(q => !usedQuestionsInDay.includes(q.text));
            const pool = availableQuestions.length > 0 ? availableQuestions : TRANSACTIONS_POOL;
            const rand = pool[Math.floor(Math.random() * pool.length)];
            if (rand) usedQuestionsInDay.push(rand.text);
            currentTx.value = rand;
            selectedDebit.value = null; selectedCredit.value = null; 
        };

        const selectAccount = (option, side) => {
            if (feedback.value) return; 
            playSound('click');
            if (side === 'debit') selectedDebit.value = option;
            if (side === 'credit') selectedCredit.value = option;
        };

        // ฟังก์ชันจิ้มเมาส์เรียกเสียงร้องเหมียวจากน้องส้ม
        const meowCat = () => {
            if (feedback.value) return; // บล็อกถ้ากำลังปริ้น
            playSound('meow');
            catState.value = 'active';
            // พอร้องทักทายเสร็จ 600ms ให้กลับไปนอนอุตุเฝ้าเครื่องต่อ
            setTimeout(() => {
                catState.value = 'sleeping';
            }, 600);
        };

        const checkAchievements = () => {
            achievements.value.forEach(ach => {
                if (ach.unlocked) return; 
                let conditionMet = false;
                if (ach.id === 'streak_5' && streak.value >= 5) conditionMet = true;
                if (ach.id === 'perfect_day' && correctCount.value === 4 && showSummary.value) conditionMet = true;
                if (ach.id === 'senior_auditor' && level.value >= 5) conditionMet = true;
                if (ach.id === 'cash_king' && cash.value >= 2000) conditionMet = true;

                if (conditionMet) {
                    ach.unlocked = true;
                    setTimeout(() => { playSound('achievement'); }, 600);
                }
            });
        };

        const submitAnswer = () => {
            if (feedback.value) return; 
            
            // สั่งเสียงปริ้นเตอร์ทำงาน พร้อมเปิดสเตตัสน้องส้มสะดุ้งตกใจเครื่องปริ้น!
            playSound('printer');
            catState.value = 'shocked';

            const amt = currentTx.value.amount;

            if (selectedDebit.value === "Cash") cash.value += amt;
            if (selectedCredit.value === "Cash") cash.value -= amt;
            if (selectedDebit.value === "Inventory") inventory.value += amt;
            if (selectedCredit.value === "Inventory") inventory.value -= amt;
            if (selectedDebit.value === "Equipment") equipment.value += amt;
            if (selectedCredit.value === "Equipment") equipment.value -= amt;
            if (selectedCredit.value === "Accounts Payable" || selectedCredit.value === "Accrued Expenses" || selectedCredit.value === "Unearned Revenue") liabilities.value += amt;
            if (selectedDebit.value === "Accounts Payable") liabilities.value -= amt;
            if (currentTx.value.type === "sale") revenue.value += amt;
            if (currentTx.value.type === "expense") expenses.value += amt;

            if (currentTx.value.correctDebit === "Cash") actualCash.value += amt;
            if (currentTx.value.correctCredit === "Cash") actualCash.value -= amt;
            if (currentTx.value.correctDebit === "Inventory") actualInventory.value += amt;
            if (currentTx.value.correctCredit === "Inventory") actualInventory.value -= amt;
            if (currentTx.value.correctDebit === "Equipment") actualEquipment.value += amt;
            if (currentTx.value.correctCredit === "Equipment") actualEquipment.value -= amt;
            if (currentTx.value.correctCredit === "Accounts Payable" || currentTx.value.correctCredit === "Accrued Expenses" || currentTx.value.correctCredit === "Unearned Revenue") actualLiabilities.value += amt;
            if (currentTx.value.correctDebit === "Accounts Payable") actualLiabilities.value -= amt;
            if (currentTx.value.type === "sale") actualRevenue.value += amt;
            if (currentTx.value.type === "expense") actualExpenses.value += amt;

            const isCorrect = selectedDebit.value === currentTx.value.correctDebit && selectedCredit.value === currentTx.value.correctCredit;
            if (isCorrect) { correctCount.value++; streak.value++; } else { streak.value = 0; }

            dayAudits.value.push({
                text: currentTx.value.text, userDebit: selectedDebit.value, userCredit: selectedCredit.value,
                correctDebit: currentTx.value.correctDebit, correctCredit: currentTx.value.correctCredit,
                isCorrect: isCorrect, explanation: currentTx.value.explanation
            });

            const now = new Date();
            ledgerEntries.value.unshift({ id: Date.now(), date: `${now.getMonth()+1}/${now.getDate()}`, description: currentTx.value.text.split(":")[0], amount: currentTx.value.type === "sale" ? amt : -amt });
            journalEntries.value.unshift({ id: Date.now(), debit: selectedDebit.value, credit: selectedCredit.value, amount: amt });

            feedback.value = { type: 'info', message: `สลิปส่งเข้า Journal: Dr. ${selectedDebit.value} / Cr. ${selectedCredit.value}` };

            checkAchievements();

            setTimeout(() => {
                const currentNum = currentTaskNumber.value;
                feedback.value = null; 
                
                // พอสลิปปริ้นเสร็จ ย้ายข้อ คืนค่าสถานะให้น้องส้มกลับไปนอนกรนต่อ
                catState.value = 'sleeping';

                if (currentNum >= 4) {
                    actualTotalAssets.value = actualCash.value + actualInventory.value + actualEquipment.value;
                    playSound(correctCount.value >= 2 ? 'success' : 'error');
                    showSummary.value = true;
                    checkAchievements();
                } else {
                    currentTaskNumber.value = currentNum + 1;
                    getNewQuestion();
                }
            }, 1000);
        };

        const startNextDay = () => {
            playSound('click');
            xp.value += correctCount.value * 50;
            if (xp.value >= level.value * 200) { level.value++; checkAchievements(); }
            currentTaskNumber.value = 1; correctCount.value = 0; dayAudits.value = []; usedQuestionsInDay = [];
            showSummary.value = false;
            getNewQuestion();
        };

        onMounted(() => { getNewQuestion(); });

        return {
            cash, inventory, equipment, revenue, expenses, liabilities, level, xp, streak,
            ledgerEntries, journalEntries, currentTx, selectedDebit, selectedCredit, feedback, showSummary,
            currentTaskNumber, dayAudits, correctCount, actualTotalAssets, currentDebitTab, currentCreditTab,
            achievements, catState, filteredDebitOptions, filteredCreditOptions, selectAccount, submitAnswer, startNextDay, meowCat
        }
    }
}).mount('#app');
