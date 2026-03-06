"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React, {useState} from "react";
import {dictionary} from "@/dictionary";
import Loader from '@/icons/loader.svg';
import Alert from "@/components/ui/alert/Alert";
import {EyeCloseIcon, EyeIcon} from "@/icons";
import passwordUserUP from "@/server/auth/passwordUserUP";
import {redirect, useRouter} from "next/navigation";
import Logo from "@/components/Logo";

export default function ResetPasswordForm() {

  const [dataForm, setDataForm] = useState<{ password: string, confirmPassword: string }>({
    confirmPassword: "",
    password: "",
  });

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const handleSubmitSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (dataForm.password !== dataForm.confirmPassword) {
      setLoading(false);
      setMessage(dictionary.msg.PASSWORD_DONT_MATCH);
      return;
    }

    const {message, success} = await passwordUserUP(dataForm.password);

    setIsSuccess(message === 'UP_USER_SUCCESS',);
    if (!success) {
      setLoading(false);
    }

    setMessage(dictionary.msg[message as keyof typeof dictionary.msg]);
    setLoading(false);

    if (success) {
      router.refresh();
      redirect("/")
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setDataForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full relative">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mx-auto mb-4">
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
           <Logo width={150} height={150}/>
        </span>
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {dictionary.auth.reset_password_title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dictionary.auth.reset_password_message}
            </p>
          </div>
          <div>
            {message && (
              <Alert
                variant={isSuccess ? "success" : "error"}
                title="Error"
                message={message}
                showLink={false}
              />
            )}
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Aquí
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmitSendEmail} className='relative'>
              <div className="space-y-6">
                <div>
                  <Label>
                    {dictionary.form.password} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={dictionary.form.write_password}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>
                    {dictionary.form.confirm_password} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder={dictionary.form.write_password_confirm}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    href="/signin"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-end"
                  >
                    {dictionary.form.remember_password}
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    {dictionary.btn.reset_password}
                  </Button>
                </div>
              </div>
              {loading && (
                <div
                  className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
                  <div className="w-32 h-32">
                    <Loader/>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
