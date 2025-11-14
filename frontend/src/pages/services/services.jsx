import ProviderBox from '../../components/providerBox/providerBox';
import styles from './services.module.css'
import { FaSearch ,FaStar } from "react-icons/fa";

export default function Services () {
    return(
        <div className={styles.services}>
            <div className={styles.servicesMenu}> 
                <a href="#">Beleza e Bem-estar</a>
                <a href="#">Cuidado Pessoal</a>
                <a href="#">Lazer e Eventos</a>
                <a href="#">Limpeza e Organização</a> 
                <a href="#">Manutenção e Reparos</a>
                <a href="#">Reforma e Construção</a>
                <a href="#">Suluções Profissionais</a>
                <a href="#">Transporte</a> 
            </div>


            <div className={styles.servicesBody}>
                <div className={styles.servicesFilter}>
                    <div className={styles.filterItem}><input type="text" /><button><FaSearch /></button></div>

                     <div className={styles.serviceClassific}>
                           <h4>Filtrar por:</h4>

                           <div className={styles.serviceClassificBox}>
                                <h2>Classificação de Profissionais</h2>
                                   <div className={styles.starSponsored}>
                                         <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                   </div>
                           </div>
                        </div>

                    <div className={styles.servicesList}>
                        <h3>Material Próprio</h3>
                        <div className={styles.serviceItem}>
                            <input type="checkbox" />
                            <span>Sim , Possuo Material</span>
                        </div>

                        <div className={styles.serviceItem}>
                            <input type="checkbox" />
                            <span>Não, o cliente fornece</span>
                        </div>

                    </div>

                    <div className={styles.servicesList}>
                        <h3>Disponibilidade</h3>
                        <div className={styles.serviceItem}>
                            <input type="checkbox" />
                            <span>Atende 24h</span>
                        </div>

                        <div className={styles.serviceItem}>
                            <input type="checkbox" />
                            <span>Atende fim de semana</span>
                        </div>
                        
                    </div>



                        
                        
                   
            </div>

                <section className={styles.providerContainer}>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                    <ProviderBox/>
                </section>
            </div>
        </div>
    )
}