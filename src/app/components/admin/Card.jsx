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

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>agendamento</CardTitle>
        <CardDescription>status do agendameto</CardDescription>
        <CardAction>
          <Button variant="link">concluir agendamento</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
       
      </CardContent>
      <CardFooter className="flex-col gap-2">
       
      </CardFooter>
    </Card>
  )
}
