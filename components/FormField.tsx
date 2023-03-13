import React from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

type Props = {
  label: string;
  error?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value?: string;
  inputStyle?: string;
  labelStyle?: string;
};
function FormField({
  label,
  error,
  placeholder,
  onChange,
  type = "text",
  value,
  inputStyle,
  labelStyle,
}: Props) {
  const [seePassword, setSeePassword] = React.useState(false);

  return (
    <div className="font-spaceMono relative">
      <div className={`mb-2 opacity-70 ${labelStyle}`}>{label}</div>
      <input
        placeholder={placeholder}
        className={`border border-black
        w-full h-12 bg-transparent
        p-2 focus:outline-none focus:ring-0 ${inputStyle}`}
        type={seePassword ? "text" : type}
        onChange={onChange}
        value={value}
      />
      {type == "password" && (
        <div
          className="absolute right-5 top-[45px] cursor-pointer"
          onClick={() => setSeePassword(!seePassword)}
        >
          {seePassword ? (
            <AiFillEyeInvisible size={20} />
          ) : (
            <AiFillEye size={20} />
          )}
        </div>
      )}
      <div className="text-red-500 mt-2">{error}</div>
    </div>
  );
}

export default FormField;
