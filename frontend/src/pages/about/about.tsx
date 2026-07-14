import styles from './about.module.css';

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <section className={styles.aboutBanner}>
        <img src="/img/banner/bannerAbout.jpeg" alt="banner sobre" />
      </section>

      <section data-aos="fade-right" className={styles.journeyContainer}>
        <div className={styles.lineSearched}></div>
        <h3>
          A Jornada que nos
          <br />
          Trouxe Até Aqui.
        </h3>

        <p data-aos="fade-right">
          A Serviços JA nasceu de uma frustração comum e universal: a busca por
          um profissional de confiança. Em 2025, nossa equipe se deparou com a
          lentidão e a insegurança das formas tradicionais de contratação,
          percebendo que o mercado carecia de uma solução que fosse
          verdadeiramente rápida e segura.
        </p>
        <p data-aos="fade-right">
          O momento de virada foi a percepção de que não bastava listar
          profissionais; era preciso garantir a conexão e a qualidade. Por que o
          cliente não pode ter um serviço resolvido agora e por que o
          profissional local não pode ter uma rede que lhe garanta renda estável
          e sem burocracia?
        </p>
        <p data-aos="fade-right">
          Nossa missão é simplificar a vida das pessoas e valorizar o trabalho
          profissional, criando conexões confiáveis e ágeis que transformam
          necessidades em soluções. Para isso, somos guiados por pilares
          inegociáveis:
        </p>
      </section>

      <div className={styles.modalContainer}>
        <div data-aos="flip-left" className={styles.modalContent}>
          <img src="/img/buttons/Rectangle1.png" alt="modal" />
          <h4>Agilidade Inovadora</h4>
        </div>

        <div data-aos="flip-left" className={styles.modalContent}>
          <img src="/img/buttons/Rectangle2.png" alt="modal" />
          <h4>Confiança e Transparência</h4>
        </div>

        <div data-aos="flip-left" className={styles.modalContent}>
          <img src="/img/buttons/Rectangle3.png" alt="modal" />
          <h4>Qualidade e Expertise</h4>
        </div>

        <div data-aos="flip-left" className={styles.modalContent}>
          <img src="/img/buttons/Rectangle4.png" alt="modal" />
          <h4>Impacto Local</h4>
        </div>
      </div>

      <section className={styles.teamContainer}>
        <h2>Conheça o Time que Faz a Magia Acontecer, JÁ!</h2>

        <div className={styles.teamContent}>
          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/renata.png" alt="" />
            <h4>Renata Santiago</h4>
            <p> Lider tecnico</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/marcos.jpeg" alt="" />
            <h4>Marcos Ribeiro</h4>
            <p>Lider Front-end</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/thiago.jpeg" alt="" />
            <h4>Thiago Nicolas</h4>
            <p>Lider Back-end</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/bruno.png" alt="" />
            <h4>Weydson Bruno</h4>
            <p>Front-end</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/cailane.jpeg" alt="" />
            <h4>Cailane Vitória </h4>
            <p>Front-end</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/joao.jpeg" alt="" />
            <h4>João Vitor</h4>
            <p>Back-end</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/inadilson.jpeg" alt="" />
            <h4>Inadilson Paz</h4>
            <p>Back-end</p>
          </div>

          <div data-aos="zoom-out" className={styles.teambox}>
            <img src="/img/students/matheus.jpeg" alt="" />
            <h4>Mathews Andrade</h4>
            <p>Chatbot | Design</p>
          </div>
        </div>
      </section>
    </div>
  );
}
