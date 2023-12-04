"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { getWeb3, initWeb3 } from "@/app/services/web3";
import Web3 from "web3";
import SocialWeb3 from "../socialWeb3.json";

//------------------------------------
const AccountProfile = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [wallet, setWallet] = useState<string>("");
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      imageURI: "",
      name: "",
      bio: "",
    },
  });

  //------------------------------------
  const handleGetAccount = useCallback(async () => {
    try {
      {
        initWeb3();
        const web3 = getWeb3();
        if (web3) {
          const accounts = await web3.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            const connectedAccount = accounts[0];
            setWallet(connectedAccount);
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, []);
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };
  async function onSubmit(submittedValues: z.infer<typeof UserValidation>) {
    const web3 = new Web3(window.ethereum);
    const contract = await new web3.eth.Contract(
      SocialWeb3.abi,
      "0x75ECb1937e1069F6BaD12a66692C93e97ad4CBf1"
    );
    const tx = await contract.methods
      .createProfileNFT([
        wallet,
        "@" + submittedValues.name,
        submittedValues.name,
        submittedValues.imageURI,
        submittedValues.bio,
      ])
      .send({
        from: wallet,
      });

    console.log(tx);
  }

  //------------------------------------
  useEffect(() => {
    handleGetAccount();
  }, []);

  //------------------------------------
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="imageURI"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className=" object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a Photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
