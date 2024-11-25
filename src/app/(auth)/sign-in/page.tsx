"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";

const signIn = () => {
   const [username, setUsername] = useState("");
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const [usernameMessage, setUsernameMessage] = useState("");
   const { toast } = useToast();

   const debounced = useDebounceCallback(setUsername, 300);

   const form = useForm({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         username: "",
         email: "",
         password: "",
      },
   });

   useEffect(() => {
      const checkUsernameUnique = async () => {
         if (username) {
            setIsCheckingUsername(true);
            setUsernameMessage("");
            try {
               const response = await axios.get(
                  `/api/check-username-unique?username=${username}`
               );
               setUsernameMessage(response.data.message);
            } catch (error: any) {
               setUsernameMessage(error.message);
            } finally {
               setIsCheckingUsername(false);
            }
         }
      };
      checkUsernameUnique();
   }, [username]);

   return <div></div>;
};

export default signIn;
