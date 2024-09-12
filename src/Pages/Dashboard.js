import React, { useEffect } from 'react'
import { useState } from 'react'
import Header from '../components/Header/header' 
import Card from '../components/Cards/card'  
import AddExpenseModal from '../components/Modals/AddExpense'   
import AddIncomeModal from '../components/Modals/AddIncome'
import { db, auth } from '../firebase'
import { addDoc , collection, query } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'
import { getDocs } from 'firebase/firestore'
import TransactionTable from '../components/TransactionTable/TransactionTable'
import Chart from '../components/Chart/Chart'
import NoTransaction from '../components/NoTransaction'

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useAuthState(auth)  
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
    const [income,setIncome] = useState(0);
    const [expense,setExpense] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    const showExpenseModal = () => {
        setIsExpenseModalVisible(true);
    };
    const showIncomeModal = () => {
        setIsIncomeModalVisible(true);
    };
    const handleExpenseCancel = () =>{
        setIsExpenseModalVisible(false)
    };
    const handleIncomeCancel = () =>{
        setIsIncomeModalVisible(false);
    };
    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: values.date.format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };
        addtransaction(newTransaction);
    };
    const addtransaction = async (transaction, many) => {
        try{
            const docRef = await addDoc(
                collection(db, `user/${user.uid}/transactions`),
                transaction
            );
            console.log("Document written with ID: ", docRef.id);
            if (!many) toast.success("Transaction added successfully");
            let newArr = transactions;  //apart from adding transaction, we also need to append the transaction to the transactions array
            newArr.push(transaction);
            setTransactions(newArr);
            
        } catch(e){
            console.error("Error adding document: ", e);
            toast.error("Error adding transaction");
            
        }
    };
    //Get all docs from collection
    useEffect(() => {
        fetchTransactions();
    }, []);

    //Calculate income and expense
    useEffect(() => {
        CalculateBalance();
    }, [transactions]);
 
    const fetchTransactions = async()=>{
        setLoading(true);
        if(user){ 
            const q = query(collection(db, `user/${user.uid}/transactions`));
            const querySnapshot = await getDocs(q);
            let transactionsArray = []; 
            querySnapshot.forEach((doc)=>{
                // doc.data() is never undefined for query doc snapshots
                transactionsArray.push(doc.data());
            });
            setTransactions(transactionsArray);
            console.log("Transactions Array",transactionsArray);
            toast.success("Transactions loaded successfully");
        }else{
            toast.error("No user")
        }
        setLoading(false);
    }

    //Calculate income and expense
    const CalculateBalance = () => {
        let totalIncome = 0;
        let totalExpense = 0;
        
        transactions.forEach((transaction) => {
            if(transaction.type === "income"){
                totalIncome += transaction.amount;
            }else{
                totalExpense += transaction.amount;     
            }
        });
        setIncome(totalIncome);
        setExpense(totalExpense);
        setTotalBalance(totalIncome - totalExpense);
    }; 

    const sortedTransaction = transactions.sort((a,b) => {
        return new Date(a.date) - new Date(b.date);
    })
    return (
        <div>
            <Header/> 
            {loading ? (<p>Loading...</p> ) : (
                <>
                <Card 
                income = {income}
                expense = {expense}
                totalBalance = {totalBalance}
                showExpenseModal = {showExpenseModal} 
                showIncomeModal = {showIncomeModal}
                />

                {transactions.length != 0 ? <Chart sortedTransaction = {sortedTransaction}/> : <NoTransaction/>}

                <AddExpenseModal
                    isExpenseModalVisible={isExpenseModalVisible}
                    handleExpenseCancel={handleExpenseCancel}
                    onFinish={onFinish}/>
    
                <AddIncomeModal
                    isIncomeModalVisible={isIncomeModalVisible}
                    handleIncomeCancel={handleIncomeCancel}
                    onFinish={onFinish}
                />
                <TransactionTable 
                transactions = {transactions} 
                addtransaction = {addtransaction} 
                fetchTransactions={fetchTransactions}/>
                </>
            )
        } 
        </div>
    )
}
export default Dashboard;