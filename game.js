// =================================================================
// 🧠 1. คลังวัตถุดิบคำศัพท์สำหรับสุ่มประกบประโยค (Matrix Vocab)
// =================================================================
const VOCAB_DOCS = ["บิลเงินสด", "ใบเสร็จรับเงิน", "ใบกำกับภาษีอย่างย่อ", "บันทึกภายใน"];

const VOCAB_ITEMS = [
    "หมึกพิมพ์สลิปสีชมพูพาสเทล", "กระดาษการ์ดเนื้อมุกสำนักงาน", "น้ำยาล้างจานสูตรถนอมมือออฟฟิศ",
    "เมล็ดกาแฟคั่วบดออร์แกนิกสำหรับรับรับแขก", "ปากกาเคมีเขียนไวท์บอร์ดสีฟรุ้งฟริ้ง",
    "กระถางต้นไม้รีไซเคิลจากขวดพลาสติก", "ดินผสมปุ๋ยสูตรพิเศษสำหรับเพาะต้นกล้าพริก"
];

const VOCAB_SERVICES = [
    "ออกแบบโลโก้และธีมแบรนด์พาสเทล", "ยิงแอดโฆษณาผ่านอินฟลูเอนเซอร์สายมินิมอล",
    "แปลเอกสารและสัญญาซื้อขายระหว่างประเทศ", "วางระบบบัญชีและภาษีออนไลน์หน้าร้าน",
    "ทำความสะอาดและจัดระเบียบคลังสินค้า", "ให้คำปรึกษาแผนการตลาดฟาร์มเป็ดอัจฉริยะ"
];

// =================================================================
// ⚖️ 2. แม่แบบล็อกเฉลยมาตรฐาน (Template Matrix) ปลอดภัยไร้บัค 100%
// =================================================================
const GENERAL_TEMPLATES = [
    {
        generate: (doc, item, cashAmt) => `${doc}: ซื้อ "${item}" เข้าออฟฟิศเป็นเงินสดทันที จำนวน $${cashAmt}`,
        type: "expense",
        correctDebit: "Utilities Expense",
        correctCredit: "Cash",
        explanation: "จ่ายค่าวัสดุสำนักงานเบ็ดเตล็ดทำให้เกิด Utilities Expense เพิ่มฝั่ง Debit คู่กับเงินสดที่ลดลงฝั่ง Credit"
    },
    {
        generate: (doc, service, cashAmt) => `${doc}: ได้รับเงินสดทันทีจากการให้บริการ "${service}" แก่ลูกค้า ยอดรวม $${cashAmt}`,
        type: "sale",
        correctDebit: "Cash",
        correctCredit: "Revenue",
        explanation: "ได้รับเงินสดทำให้สินทรัพย์ (Cash) เพิ่มขึ้นฝั่ง Debit คู่กับการรับรู้รายได้บริการเพิ่มขึ้นฝั่ง Credit"
    },
    {
        generate: (doc, item, cashAmt) => `${doc}: ซื้อ "${item}" เข้าคลังสต็อกร้านเพื่อเตรียมขายต่อ จ่ายด้วยเงินสด $${cashAmt}`,
        type: "purchase",
        correctDebit: "Inventory",
        correctCredit: "Cash",
        explanation: "ซื้อสินค้าเข้าคลังทำให้สินทรัพย์ (Inventory) เพิ่มขึ้นฝั่ง Debit คู่กับเงินสดที่ลดลงฝั่ง Credit"
    },
    {
        generate: (doc, service, creditAmt) => `${doc}: ส่งใบแจ้งหนี้เรียกเก็บเงินลูกค้าสำหรับงาน "${service}" เป็นเงินเชื่อ ยอด $${creditAmt}`,
        type: "sale",
        correctDebit: "Accounts Receivable",
        correctCredit: "Revenue",
        explanation: "ทำงานเสร็จแล้วรับรู้รายได้เพิ่มฝั่ง Credit สิทธิเรียกร้องเงินงวดหน้าจัดเป็นสินทรัพย์ชื่อลูกหนี้การค้าอยู่ฝั่ง Debit"
    },
    {
        generate: (doc, item, creditAmt) => `${doc}: สั่งซื้อแฟ้มและอุปกรณ์จัดเก็บ "${item}" มาติดตั้งในออฟฟิศ 'เป็นเงินเชื่อ' ค้างจ่ายไว้ก่อน ยอด $${creditAmt}`,
        type: "purchase",
        correctDebit: "Equipment",
        correctCredit: "Accounts Payable",
        explanation: "ได้อุปกรณ์สำนักงานถาวรเพิ่มขึ้นฝั่ง Debit คู่กับภาระผูกพันหนี้สินเจ้าหนี้การค้าเพิ่มขึ้นฝั่ง Credit"
    }
];

const TAX_TEMPLATES = [
    {
        generate: (doc, service, amt) => `บิลภาษี: กิจการจ่ายเงินสดค่าบริการ "${service}" ให้ฟรีแลนซ์ $${amt} และได้ทำการหักภาษี ณ ที่จ่ายเอาไว้ 3% ตามเกณฑ์บุคคลธรรมดา ส่วนที่เหลือจ่ายเป็นเงินสด`,
        type: "expense",
        correctDebit: "Advertising Expense",
        correctCredit: "Cash, Withholding Tax Payable",
        explanation: "เดบิตค่าใช้จ่ายโฆษณา/บริการเต็มจำนวน ส่วนฝั่งเครดิตจะผสมระหว่างเงินสดที่จ่ายจริง 97% คู่กับภาษีหัก ณ ที่จ่ายค้างจ่ายซึ่งเป็นหนี้สินรอนำส่งอีก 3%"
    },
    {
        generate: (doc, service, amt) => `บิลภาษี: กิจการออกใบเสร็จรับเงินค่าบริการ "${service}" ให้ลูกค้า ยอดก้อนโต $${amt} และมีการบันทึกเรียกเก็บ 'ภาษีขาย (VAT 7%)' ร่วมด้วยเป็นเงินสด`,
        type: "sale",
        correctDebit: "Cash",
        correctCredit: "Revenue, Sale Tax",
        explanation: "เดบิตเงินสดรวมทั้งหมดที่ได้รับจริงฝั่งเดบิต คู่กับฝั่งเครดิตที่แยกเป็นรายได้หลักของกิจการ และภาษีขายซึ่งถือเป็นหนี้สินผูกพันรอนำส่งสรรพากร"
    },
    {
        generate: (doc, item, amt) => `บิลภาษี: ซื้อชั้นวางและ "${item}" มาใช้งานในคลังสินค้า ยอดเงิน $${amt} (ยังไม่รวมภาษีมูลค่าเพิ่ม) โดยบันทึกแยก 'ภาษีซื้อ (VAT 7%)' ชำระด้วยเงินสดรวม`,
        type: "purchase",
        correctDebit: "Equipment, Purchase Tax",
        correctCredit: "Cash",
        explanation: "เดบิตสิทธิประโยชน์ทางภาษีซื้อ (สินทรัพย์) คู่กับตัวอุปกรณ์สำนักงานเพิ่มขึ้นฝั่งเดบิต ส่วนเครดิตจะหักลดยอดเงินสดรวมก้อนใหญ่ออกไป"
    }
];

const ACCOUNT_CATEGORIES = {
    assets: ["Cash", "Inventory", "Accounts Receivable", "Equipment", "Prepaid Insurance", "Purchase Tax", "Accumulated Depreciation"],
    liabs: ["Accounts Payable", "Accrued Expenses", "Unearned Revenue", "Drawings", "Sale Tax", "Withholding Tax Payable"],
    exp: ["Revenue", "Rent Expense", "Utilities Expense", "Salary Expense", "Advertising Expense", "Corporate Tax Expense", "Depreciation Expense"]
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
        let now = audioCtx.currentTime;
        osc.type = 'triangle';
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
        
        const currentTx = ref({}); 
        const selectedDebits = ref([]); 
        const selectedCredits = ref([]); 
        
        const feedback = ref(null); const showSummary = ref(false);
        const currentTaskNumber = ref(1); const dayAudits = ref([]); const correctCount = ref(0);
        const actualTotalAssets = ref(1500);

        const currentDebitTab = ref('assets');
        const currentCreditTab = ref('assets');
        const catState = ref('sleeping');
        const currentDay = ref(1);
        const isTaxDay = computed(() => currentDay.value % 5 === 0);

        const achievements = ref([
            { id: 'streak_5', title: '🏅 บันทึกมือโปร (Streak x5)', icon: '⚡', unlocked: false },
            { id: 'perfect_day', title: '📈 งบดุลไร้รอยต่อ (เต็ม 4/4)', icon: '💯', unlocked: false },
            { id: 'senior_auditor', title: '🎓 เซนียร์ออดิเตอร์ (LV.5)', icon: '🔮', unlocked: false },
            { id: 'cash_king', title: '💰 มหาเศรษฐีกิจการ ($2K+)', icon: '👑', unlocked: false }
        ]);

        const filteredDebitOptions = computed(() => ACCOUNT_CATEGORIES[currentDebitTab.value]);
        const filteredCreditOptions = computed(() => ACCOUNT_CATEGORIES[currentCreditTab.value]);

        // =================================================================
        // 🔄 3. ฟังก์ชันสุ่มต่อประโยคอัจฉริยะ (Dynamic Question Generator)
        // =================================================================
        const getNewQuestion = () => {
            const doc = VOCAB_DOCS[Math.floor(Math.random() * VOCAB_DOCS.length)];
            const item = VOCAB_ITEMS[Math.floor(Math.random() * VOCAB_ITEMS.length)];
            const service = VOCAB_SERVICES[Math.floor(Math.random() * VOCAB_SERVICES.length)];
            // สุ่มเม็ดเงินแบบไม่ซ้ำซาก
            const randAmt = (Math.floor(Math.random() * 15) + 1) * 50; 

            let selectedTemplate;
            if (isTaxDay.value) {
                // โหมดวันภาษี ดึงจากคลังภาษีผสม Compound
                selectedTemplate = TAX_TEMPLATES[Math.floor(Math.random() * TAX_TEMPLATES.length)];
            } else {
                // วันปกติ ดึงจากคลังทั่วไป
                selectedTemplate = GENERAL_TEMPLATES[Math.floor(Math.random() * GENERAL_TEMPLATES.length)];
            }

            // สั่งรันฟังก์ชันประกบประโยคไดนามิก
            const textResult = selectedTemplate.generate(doc, selectedTemplate.type === "sale" || selectedTemplate.correctDebit.includes("Advertising Expense") ? service : item, randAmt);

            currentTx.value = {
                text: textResult,
                amount: randAmt,
                type: selectedTemplate.type,
                correctDebit: selectedTemplate.correctDebit,
                correctCredit: selectedTemplate.correctCredit,
                explanation: selectedTemplate.explanation
            };

            selectedDebits.value = []; 
            selectedCredits.value = []; 
        };

        const selectAccount = (option, side) => {
            if (feedback.value) return; 
            playSound('click');
            
            if (side === 'debit') {
                if (selectedDebits.value.includes(option)) {
                    selectedDebits.value = selectedDebits.value.filter(item => item !== option);
                } else {
                    selectedDebits.value.push(option);
                }
            }
            if (side === 'credit') {
                if (selectedCredits.value.includes(option)) {
                    selectedCredits.value = selectedCredits.value.filter(item => item !== option);
                } else {
                    selectedCredits.value.push(option);
                }
            }
        };

        const meowCat = () => {
            if (feedback.value) return; 
            playSound('meow'); catState.value = 'active';
            setTimeout(() => { catState.value = 'sleeping'; }, 600);
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
            
            playSound('printer');
            catState.value = 'shocked';

            const amt = currentTx.value.amount;

            if (selectedDebits.value.includes("Cash")) cash.value += amt;
            if (selectedCredits.value.includes("Cash")) cash.value -= amt;
            if (selectedDebits.value.includes("Inventory")) inventory.value += amt;
            if (selectedCredits.value.includes("Inventory")) inventory.value -= amt;
            if (selectedDebits.value.includes("Equipment")) equipment.value += amt;
            if (selectedCredits.value.includes("Equipment")) equipment.value -= amt;
            
            if (selectedDebits.value.includes("Corporate Tax Expense") || selectedDebits.value.includes("Advertising Expense")) expenses.value += amt;
            if (currentTx.value.type === "sale") revenue.value += amt;
            if (currentTx.value.type === "expense") expenses.value += amt;

            if (currentTx.value.correctDebit.includes("Cash")) actualCash.value += amt;
            if (currentTx.value.correctCredit.includes("Cash")) actualCash.value -= amt;
            if (currentTx.value.correctDebit.includes("Inventory")) actualInventory.value += amt;
            if (currentTx.value.correctCredit.includes("Inventory")) actualInventory.value -= amt;
            if (currentTx.value.correctDebit.includes("Equipment")) actualEquipment.value += amt;
            if (currentTx.value.correctCredit.includes("Equipment")) actualEquipment.value -= amt;
            if (currentTx.value.type === "sale") actualRevenue.value += amt;
            if (currentTx.value.type === "expense") actualExpenses.value += amt;

            const userDebStr = [...selectedDebits.value].sort().join(", ");
            const userCreStr = [...selectedCredits.value].sort().join(", ");
            
            const correctDebStr = currentTx.value.correctDebit.split(", ").sort().join(", ");
            const correctCreStr = currentTx.value.correctCredit.split(", ").sort().join(", ");

            const isCorrect = (userDebStr === correctDebStr) && (userCreStr === correctCreStr);
            
            if (isCorrect) { correctCount.value++; streak.value++; } else { streak.value = 0; }

            dayAudits.value.push({
                text: currentTx.value.text, 
                userDebit: userDebStr, 
                userCredit: userCreStr,
                correctDebit: currentTx.value.correctDebit, 
                correctCredit: currentTx.value.correctCredit,
                isCorrect: isCorrect, 
                explanation: currentTx.value.explanation
            });

            const now = new Date();
            ledgerEntries.value.unshift({ id: Date.now(), date: `${now.getMonth()+1}/${now.getDate()}`, description: currentTx.value.text.split(":")[0], amount: currentTx.value.type === "sale" ? amt : -amt });
            journalEntries.value.unshift({ id: Date.now(), debit: userDebStr, credit: userCreStr, amount: amt });

            feedback.value = { type: 'info', message: `สลิปยื่นแบบ: Dr. ${userDebStr} / Cr. ${userCreStr}` };
            checkAchievements();

            setTimeout(() => {
                const currentNum = currentTaskNumber.value;
                feedback.value = null; 
                catState.value = 'sleeping';

                if (currentNum >= 4) {
                    actualTotalAssets.value = actualCash.value + actualInventory.value + actualEquipment.value;
                    if (isTaxDay.value && correctCount.value === 4) {
                        cash.value += 300; actualCash.value += 300;
                    }
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
            currentDay.value++;
            currentTaskNumber.value = 1; correctCount.value = 0; dayAudits.value = [];
            showSummary.value = false;
            getNewQuestion();
        };

        onMounted(() => { getNewQuestion(); });

        return {
            cash, inventory, equipment, revenue, expenses, liabilities, level, xp, streak,
            ledgerEntries, journalEntries, currentTx, selectedDebits, selectedCredits, feedback, showSummary,
            currentTaskNumber, dayAudits, correctCount, actualTotalAssets, currentDebitTab, currentCreditTab,
            achievements, catState, currentDay, isTaxDay, filteredDebitOptions, filteredCreditOptions, 
            selectAccount, submitAnswer, startNextDay, meowCat
        }
    }
}).mount('#app');
