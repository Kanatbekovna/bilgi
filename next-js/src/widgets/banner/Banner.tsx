import scss from "./banner.module.scss";

export default function Banner() {
  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <h3>• Test Yayını</h3>
          <div className={scss.head}>
            <h1>IZDENGo</h1>
            <h5>DINÎ ARAŞTIRMALAR VERİ TABANI</h5>
            <h2>“Dinî Araştırmaların Dijital Hafızası”</h2>
          </div>
          <p>
            İlahiyat alanındaki{" "}
            <span> yazma eser, kitap, tez, makale ve bildiri</span> gibi
            akademik çalışmalara açık erişim bağlantıları sunan bir akademik
            bilgi ağı ve atıf dizini
          </p>
          <div className={scss.search}>
            <input
              type="text"
              placeholder="Makale, yazar, anahtar kelime veya kavram arayın..."
            />
            <button>🔎ИЗДӨӨ</button>
          </div>
          <a href="#">Gelişmiş Arama</a>
        </div>
      </div>
    </div>
  );
}
