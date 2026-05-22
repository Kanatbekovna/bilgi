import scss from "./register.module.scss";

export default function Register() {
  return (
    <div className={scss.container}>
      <div className={scss.mainContainer}>
        <h2>Каттоо</h2>

        <p className={scss.desc}>
          Аккаунт түзүңүз — ал администратор бекиткенден кийин активдештирилет.
        </p>

        <div className={scss.form}>
          <div className={scss.row}>
            <div className={scss.field}>
              <h5>Атыңыз</h5>
              <input type="text" placeholder="Сиздин Атыңыз" />
            </div>

            <div className={scss.field}>
              <h5>Фамилия</h5>
              <input type="text" placeholder="Фамилияңыз" />
            </div>
          </div>
        </div>

        <p className={scss.loginText}>
          Сизде аккаунт барбы? <a href="./login">Кирүү</a>
        </p>
      </div>
    </div>
  );
} 