"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiFolder } from "react-icons/fi";
import scss from "./register.module.scss";

export default function Register() {
  const { push } = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error,  setError]  = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", country_city: "",
    academic_degree: "", academic_title: "",
    workplace: "", position: "",
    competence: "", interests: "",
    email: "", phone: "",
    additional_info: "", password: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.country_city || !form.phone) {
      setError("Заполните все обязательные поля (*)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, files: fileName || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={scss.page}>
      <div className={scss.card}>

        <button className={scss.back} onClick={() => push("/login")}>
          <FiArrowLeft /> Артка
        </button>

        <div className={scss.header}>
          <h1 className={scss.title}>Автордун анкетасы</h1>
          <p className={scss.desc}>
            Биздин сайттын автору болуу үчүн төмөндөгү анкетаны толтуруңуз.
            Анкета сиз тууралуу жалпы маалымат алууга жардам берет.
            Исламдык илимий-билим берүүчү энциклопедия жаңы авторлор менен
            кызматташууга ачык жана долбоорубузга кызыгуу көрсөткөнүңүз үчүн ыраазычылык билдирет.
          </p>
        </div>

        <div className={scss.grid}>
          <input className={scss.input} placeholder="Аты-жөнү *" value={form.name} onChange={set("name")} />
          <input className={scss.input} placeholder="Өлкө, шаар *" value={form.country_city} onChange={set("country_city")} />
          <select className={`${scss.input} ${scss.select}`} value={form.academic_degree} onChange={set("academic_degree")}>
            <option value="" disabled hidden>Илимий даража</option>
            <option value="PhD доктор">PhD доктор</option>
            <option value="профессор">Профессор</option>
            <option value="илимдин кандидаты">Илимдин кандидаты</option>
            <option value="илимдин доктору">Илимдин доктору</option>
          </select>
          <input className={scss.input} placeholder="Илимий наам" value={form.academic_title} onChange={set("academic_title")} />
          <input className={`${scss.input} ${scss.fullWidth}`} placeholder="Иштеген же окуган жери *" value={form.workplace} onChange={set("workplace")} />
          <input className={`${scss.input} ${scss.fullWidth}`} placeholder="Кызматы / статусу *" value={form.position} onChange={set("position")} />
          <input className={`${scss.input} ${scss.fullWidth}`} placeholder="Илимий компетенциясынын багыты *" value={form.competence} onChange={set("competence")} />
          <input className={`${scss.input} ${scss.fullWidth}`} placeholder="Илимий кызыкчылыктарынын багыты *" value={form.interests} onChange={set("interests")} />
          <input className={scss.input} placeholder="E-mail *" type="email" value={form.email} onChange={set("email")} />
          <input className={scss.input} placeholder="Уюлдук телефон *" value={form.phone} onChange={set("phone")} />
          <input className={scss.input} placeholder="Сырсөз *" type="password" value={form.password} onChange={set("password")} />
          <div />
          <textarea className={`${scss.textarea} ${scss.fullWidth}`} placeholder="Кошумча маалымат *" value={form.additional_info} onChange={set("additional_info")} rows={4} />
        </div>

        <div className={scss.fileRow}>
          <button className={scss.fileBtn} onClick={() => fileRef.current?.click()}>
            <FiFolder /> {fileName || "Файл тиркөө"}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.zip,.rar,.docx,.jpeg,.jpg,.png" onChange={onFile} hidden />
        </div>

        <div className={scss.hint}>
          <p>Жүктөөгө уруксат берилген форматтар: *.pdf, *.zip, *.rar, *.docx, *.jpeg, *.jpg, *.png</p>
          <p>Бир файлдын максималдуу көлөмү — 5 МБ. Бардык файлдардын жалпы көлөмү — 20 МБ</p>
        </div>

        <div className={scss.required}>
          <p>Жылдызча (*) менен белгиленген талаалар толтурулушу милдеттүү.</p>
          <p>
            Анкетаны жөнөтүү менен Сиз жеке маалыматтарыңызды иштетүүгө макулдугуңузду
            билдиресиз{" "}
            <span className={scss.policy}>(Купуялык саясатына ылайык)</span>
          </p>
        </div>

        {error && <p className={scss.error}>{error}</p>}

        <button className={scss.submit} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : "Анкетаны жөнөтүү"}
        </button>

      </div>
    </div>
  );
}
