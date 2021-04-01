import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from "axios";
import { useEffect, useState } from 'react';

export default function Home() {
  const [tok, setTok] = useState();
  const [exp, setExp] = useState();
  const [zip, setZip] = useState();
  const [stores, setStores] = useState([]);
  const [items, setItems] = useState([])

  useEffect(() => {
    const bin = btoa(`${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`)
  
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${bin}`, 
      }
      }
    
      axios
        .post('https://api-ce.kroger.com/v1/connect/oauth2/token?scope=product.compact', "grant_type=client_credentials", config)
        .then(res => {
          // console.log(res.data)
          setTok(res.data.access_token)
          setExp(res.data.expires_in)
        })
        .catch(err => err.message)
  },[])
  
  const handleFetch = () => {
  
    let config2 = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tok}`
      }
      }
  
    // axios
    // .get(`https://api-ce.kroger.com/v1/locations?filter.zipCode.near=${zip}`, config2)
    // .then(res => {
    //   console.log(res.data.data);
    //   let stores = res.data.data.filter(kr => kr.chain !== "SHELL COMPANY" && kr.chain !== "THE LITTLE CLINIC");
    //   setStores(stores);
    //   console.log(exp);
    // })
    // .catch(err => err.message)

    axios
    .get(`https://api-ce.kroger.com/v1/products?filter.term=beyond&filter.locationId=02500402`, config2)
    .then(res => {
      console.log(res.data.data);
      let stores = res.data.data.filter(item => item.categories[0] !== "Pet Care" && item.categories[0] !== "Gift Cards");
      setItems(stores);
    })
    .catch(err => err.message)
  }

  const handleZipChange = e => {
    setZip(e.target.value);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Plant Based Promos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
         Plant Based Promos
        </h1>
        <p className={styles.description}>A hub for local low-priced plant based groceries</p>

        <div className={styles.grid}>
          <div>
            <label>Enter Zip Code</label>
            <input
            type="text"
            placeholder="Zip Code"
            name="zip"
            onChange={handleZipChange}
            />
          </div>
         <button onClick={handleFetch}>Search</button>
        </div>
        <div className={styles.grid}>
          {/* {stores.map(store => (
            <div className={styles.card}>
            <h4>{store.chain}</h4>
            <p>{store.address.addressLine1}</p>
            </div>
          ))} */}
        </div>
        <div className={styles.grid}>
          {items.map(item => (
            <div className={styles.card}>
            <h4>{item.brand}</h4>
            <p>{item.description}</p>
            {/* <img alt={item.description} src={item.images[0].sizes[0].url} /> */}
            <p>{item.price ? item.price.price : "No price available"}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}