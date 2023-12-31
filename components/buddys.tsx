import { Buddy } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface BuddysProps {
  data: (Buddy & {
    _count: {
      messages: number;
    };
  })[];
}

export const Buddys = ({ data }: BuddysProps) => {
  if (data.length === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-60 h-60">
          <Image fill className="grayscale" src="/empty.jpg" alt="Empty" />
        </div>
        <div className="text-sm text-gray-400">Try another search</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {data.map((item) => (
        <Card
          key={item.name}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/chat/${item.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-primary-foreground">
              <div className="relative w-32 h-32">
                <Image
                  fill
                  className="rounded-xl object-cover"
                  src={item.src}
                  alt="Buddy"
                />
              </div>
              <p className="text-bold text-primary">{item.name}</p>
              <p className="text-xs text-primary">{item.description}</p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{item.userName}</p>
              <div className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {item._count.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};
