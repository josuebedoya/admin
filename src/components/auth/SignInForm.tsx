"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {EyeCloseIcon, EyeIcon} from "@/icons";
import Link from "next/link";
import React, {useState} from "react";
import {dictionary} from "@/dictionary";
import Image from "next/image";
import signIn from "@/server/auth/signIn";
import Loader from '@/icons/loader.svg';
import {useModal} from "@/hooks/useModal";
import {Modal} from "@/components/ui/modal";
import {redirect, useRouter} from "next/navigation";
import Alert from "@/components/ui/alert/Alert";

export default function SignInForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [dataForm, setDataForm] = useState<{ email: string, password: string }>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('')
  const {isOpen, openModal, closeModal} = useModal();
  const [user, setUser] = useState<{ name: string }>({name: ''});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {data, message, success} = await signIn(dataForm);

    if (!success) {
      setLoading(false);
      setMessage(dictionary.msg[message as keyof typeof dictionary.msg] || 'Error al iniciar sesión');
      return;
    }

    setUser(data?.user?.user_metadata);
    setLoading(false);
    openModal();
  };

  const start = () => {
    router.refresh();
    redirect("/")
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setDataForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mx-auto mb-4">
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
            <Image
              width={150}
              height={150}
              src="/images/logo/logo.png"
              alt="User"
            />
        </span>
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {dictionary.auth.sign_in}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dictionary.auth.sign_in_message}
            </p>
          </div>
          <div>
            {message && (
              <Alert
                variant="error"
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
            <form onSubmit={handleSubmit} className='relative'>
              <div className="space-y-6">
                <div>
                  <Label>
                    {dictionary.form.email} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    name="email"
                    placeholder="info@gmail.com"
                    type="email"
                    onChange={handleInputChange}
                  />
                </div>
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
                <div className="flex items-center justify-end">
                  <Link
                    href="/reset-password/"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-end"
                  >
                    {dictionary.form.forgot_password}
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    {dictionary.btn.sign_in}
                  </Button>
                </div>
              </div>
              {
                loading && (
                  <div
                    className="loader absolute inset-0 bg-white/80 w-[110%] h-[110%] shadow-lg rounded-xl -left-[5%] -top-[5%] flex items-center justify-center">
                    <div className="w-32 h-32">
                      <Loader/>
                    </div>
                  </div>
                )
              }
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                {dictionary.auth.sign_up_invite}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {" "}Aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="welcome lg:p-11 flex flex-col items-center">
          <h2
            className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
            {dictionary.welcome.title}
          </h2>
          <h4 className='text-center text-5xl font-bold mt-16'>{user?.name}</h4>
          <Button
            className='text-center mx-auto mt-16 lg:mt-24'
            onClick={start}
          >
            ! Vamos !
          </Button>
        </div>
      </Modal>
    </div>
  );
}
