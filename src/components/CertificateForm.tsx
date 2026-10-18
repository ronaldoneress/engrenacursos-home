"use client";

import { useState, useEffect, useCallback } from "react";
import { CURSOS_FORM } from "@/lib/cursos";

interface FormData {
  studentName: string;
  cpf: string;
  completionDate: string;
  course: string;
  city: string;
  cargaHoraria: string;
}

interface CertificateFormProps {
  onGenerate: (data: FormData & { validationCode: string; regNumber: string }) => void;
}

// Courses imported from @/lib/cursos as CURSOS_FORM

function generateValidationCode(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ENG-${year}-${code}`;
}

function generateRegNumber(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export default function CertificateForm({ onGenerate }: CertificateFormProps) {
  const [form, setForm] = useState<FormData>({
    studentName: "",
    cpf: "",
    completionDate: "",
    course: "",
    city: "Ribeira do Pombal - BA",
    cargaHoraria: "60",
  });
  const [validationCode, setValidationCode] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValidationCode(generateValidationCode());
    setRegNumber(generateRegNumber());
  }, []);

  const regenerateCode = useCallback(() => {
    setValidationCode(generateValidationCode());
    setRegNumber(generateRegNumber());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      setForm((prev) => ({ ...prev, cpf: formatCPF(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.studentName.trim()) newErrors.studentName = "Nome do aluno é obrigatório";
    if (!form.cpf || form.cpf.replace(/\D/g, "").length !== 11)
      newErrors.cpf = "CPF inválido (digite 11 dígitos)";
    if (!form.completionDate) newErrors.completionDate = "Data de conclusão é obrigatória";
    if (!form.course) newErrors.course = "Selecione um curso";
    if (!form.city.trim()) newErrors.city = "Cidade é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onGenerate({ ...form, validationCode, regNumber });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Dados do Aluno
        </h2>
      </div>

      {/* Student Name */}
      <div>
        <label htmlFor="studentName" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          Nome Completo do Aluno
        </label>
        <input
          type="text"
          id="studentName"
          name="studentName"
          value={form.studentName}
          onChange={handleChange}
          placeholder="Digite o nome completo"
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
            ${errors.studentName
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-secondary placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-primary/50"
            }`}
        />
        {errors.studentName && <p className="mt-1 text-xs text-red-500">{errors.studentName}</p>}
      </div>

      {/* CPF */}
      <div>
        <label htmlFor="cpf" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          CPF
        </label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
          maxLength={14}
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 font-mono tracking-wider
            ${errors.cpf
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-secondary placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-primary/50"
            }`}
        />
        {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf}</p>}
      </div>

      {/* Completion Date */}
      <div>
        <label htmlFor="completionDate" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          Data de Conclusão do Curso
        </label>
        <input
          type="date"
          id="completionDate"
          name="completionDate"
          value={form.completionDate}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
            ${errors.completionDate
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-secondary hover:border-gray-300 focus:bg-white focus:border-primary/50"
            }`}
        />
        {errors.completionDate && <p className="mt-1 text-xs text-red-500">{errors.completionDate}</p>}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          Cidade / Estado
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Ex: Ribeira do Pombal - BA"
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
            ${errors.city
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-secondary placeholder:text-gray-400 hover:border-gray-300 focus:bg-white focus:border-primary/50"
            }`}
        />
        {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
      </div>

      {/* Course Selection */}
      <div>
        <label htmlFor="course" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          Curso Presencial (60h)
        </label>
        <select
          id="course"
          name="course"
          value={form.course}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 bg-gray-50
            ${errors.course
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-gray-200 text-secondary hover:border-gray-300 focus:bg-white focus:border-primary/50"
            }`}
        >
          <option value="" className="text-gray-400">Selecione o curso...</option>
          {CURSOS_FORM.map((c) => (
            <option key={c} value={c} className="text-secondary">{c}</option>
          ))}
        </select>
        {errors.course && <p className="mt-1 text-xs text-red-500">{errors.course}</p>}
      </div>

      {/* Validation Code */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
          Código de Validação
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5 font-mono text-sm text-primary font-bold tracking-wider">
            {validationCode}
          </div>
          <button
            type="button"
            onClick={regenerateCode}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-primary transition-all duration-200 cursor-pointer"
            title="Gerar novo código"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary
                   text-white font-bold text-sm transition-all duration-300 cursor-pointer
                   flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30
                   hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Gerar Pré-visualização
      </button>
    </form>
  );
}
