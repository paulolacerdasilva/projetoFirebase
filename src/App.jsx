import { useState, useEffect } from 'react'
import { db, auth } from './firebaseConnection';
import { doc, setDoc, 
  collection, addDoc, 
  getDoc, getDocs, 
  updateDoc, deleteDoc, onSnapshot} from 'firebase/firestore'
import './app.css';
import { async } from '@firebase/util';
import {createUserWithEmailAndPassword} from 'firebase/auth'
function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('');

  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');


  useEffect(()=>{
    async function loadPost(){
      const unsub = onSnapshot(collection(db,'posts'),(snapshot)=>{
        let listaPost = [];
        snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      setPosts(listaPost);
      })
    }
    loadPost();
  },[])

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth,email,senha)
    .then(()=>{
      console.log("cadastrado com sucesso!")
      setEmail(''); //limpa o campo de email
      setSenha('');//limpa o campo  de senha
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca.")
      } else if(error.code === 'auth/email-already-in-use'){
        alert("email já existe")
      }
    })
  }
  async function handleAdd(){
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   console.log("DADOS REGISTRADO NO BANCO!")
    // })
    // .catch((error) => {
    //   console.log("GEROU ERRO" + error)
    // }) 

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("CADASTRADO COM SUCESSO")
      setAutor('');
      setTitulo('')
    })
    .catch((error) => {
      console.log("ERRO " + error)
    })


  }

  async function buscarPost(){
    // const postRef = doc(db, "posts", "vFvZAyFqebXFsFv0X89l")
    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)

    // })
    // .catch(()=>{
    //   console.log("ERRO AO BUSCAR")
    // })

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR")
    })
  }

  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    await updateDoc(docRef,{
      titulo: titulo,
      autor:autor
    })
    .then(()=>{
      console.log("Atualizado com sucesso")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(()=>{
      console.log("erro ao atualizar banco")
    })
  }

 async function excluirPost(id){
   const docRef = doc(db,'posts',id) 
   await deleteDoc(docRef)
   .then(()=>{
    alert("post deletedao com sucesso")
   })
   .catch((error)=>{
    alert("Erro"+error)
   })
}

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>
    <div className='container'>
      <h2>Usuários </h2>
      <label>Email: </label>
      <input type="email"
      placeholder="seuemail@provedor.com"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}/><br/>
       <label>Senha: </label>
      <input type="password"
      placeholder="informe sua senha"
      value={senha}
      onChange={(e)=>setSenha(e.target.value)}/><br/>
      <button onClick={novoUsuario}>Cadastrar</button>
    </div>
    <br/><br/>
<hr/>
    <div className="container">
      <h2>Posts</h2>
      <label>IdPost</label>
      <input type="text" 
      placeholder="informe o id"
      value={idPost}
      onChange={(e) => setIdPost(e.target.value)}/> <br/>
      <label>Titulo:</label>
      <textarea 
        type="text"
        placeholder='Digite o titulo'
        value={titulo}
        onChange={ (e) => setTitulo(e.target.value) }
      />

      <label>Autor:</label>
      <input 
        type="text" 
        placeholder="Autor do post"
        value={autor}
        onChange={(e) => setAutor(e.target.value) }
      />

      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscarPost}>Buscar post</button>
      <button onClick={editarPost}>Editar Post</button>

      <ul>
        {posts.map( (post) => {
          return(
            <li key={post.id}>
              <strong>Id Post: {post.id}</strong> <br/>
              <span>Titulo: {post.titulo} </span> <br/>
              <span>Autor: {post.autor}</span> <br/> 
              <button onClick={()=>excluirPost(post.id)}>Excluir</button> <br/>
            </li>
          )
        })}
      </ul>

    </div>

    </div>
  );
}

export default App;

/*
import {useState} from 'react';
import {db} from './firebaseConnection';
import {doc, setDoc, collection, addDoc, getDoc, getDocs} from 'firebase/firestore';
import "./App.css";
import { async } from '@firebase/util';

function App(){
const[titulo, setTitulo] = useState('');
const[autor, setAutor] = useState('');
const[post, setpost] = useState([]);

   async function handleAdd(){
      await setDoc(doc(db,"posts","12345"),{
        titulo: titulo,
        autor: autor,
       })
       .then(()=>{
        console.log("Dados registrados no  banco!")
       })
       .catch((error)=>{
        console.log("Gerrou Erro "+ error)
       }) 
       
       await addDoc(collection(db,"posts"),{
        titulo:titulo,
        autor:autor,
       })
       .then(()=>{
        console.log("Dados gravados no banco!")
        setAutor('');
        setTitulo('');
       })
       .catch((error)=>{
        console.log("Gerou erro "+ error)
       })
    }
    async function buscarPost(){
        const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR")
    })
        
        const postRef = doc(db,"posts", "p5OHYqMl8tsT5wGiX861")
        await getDoc(postRef)
        .then((snapshat)=>{
            setAutor(snapshat.data().autor)
            setTitulo(snapshat.data().titulo)
        })
        .catch(()=>{
        console.log("Gerou erro "+ error)
        })
        
    }
    return(
        <div>
            <h1>React + Firebase</h1>
            <div className='container'>
                <label>Titulo:</label>
                <textarea type="text"
                placeholder="Digite o titulo"
                value={titulo}
                onChange={(e)=> setTitulo(e.target.value)}
                >  
               
                </textarea>
                <label>Autor:</label>
                <input type="text"
                placeholder="Digite o autor do post"
                value={autor}
                onChange={(e)=> setAutor(e.target.value)}>
                </input>
                <button onClick={handleAdd}>Cadastrar</button>
                <button onClick={buscarPost}>Buscar Post</button>

                <ul>
        {posts.map( (post) => {
          return(
            <li key={post.id}>
              <span>Titulo: {post.titulo} </span> <br/>
              <span>Autor: {post.autor}</span> <br/>  <br/>
            </li>
          )
        })}
      </ul>

            </div>
        </div>
    );
}

export default App;
*/
