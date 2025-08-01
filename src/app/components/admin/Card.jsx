import { useEffect, useState } from "react";

import { Button } from "../../../../@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Agendamento</CardTitle>   
        <CardDescription>status do agendameto</CardDescription>
         </CardHeader>
       
      
      <CardContent>
        <article className="flex items-center gap-2 border-b py-2">
            <Avatar classname="H-8 W-8">
                <AvatarImage src=""/>
                <AvatarFallback>NG</AvatarFallback>
            </Avatar>
        </article>
       
      </CardContent>
      <CardFooter className="flex-col gap-2">
       
      </CardFooter>
    </Card>
  )
}
