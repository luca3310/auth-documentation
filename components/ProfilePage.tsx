"use client";

import { useState } from "react";
import { ArrowLeft, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProfilePage({ onBack }: { onBack: () => void }) {
    const [showSecretKey, setShowSecretKey] = useState(false);

    const userProfile = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        avatar: "/placeholder.svg?height=100&width=100",
        roles: [
            { name: "Admin", access: "Full access to all features" },
            { name: "Developer", access: "API access and documentation" },
        ],
        secretKey: "testKey",
    };

    return (
        <div className="p-8 min-h-screen bg-background">
            <Button variant="ghost" onClick={onBack} className="mb-6">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Documentation
            </Button>

            <Card className="mx-auto max-w-2xl">
                <CardHeader className="flex flex-row gap-4 items-center">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                        <AvatarFallback>
                            <User className="w-10 h-10" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{userProfile.name}</CardTitle>
                        <CardDescription>{userProfile.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={userProfile.email} readOnly />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={userProfile.name} readOnly />
                    </div>

                    <div className="space-y-2">
                        <Label>Roles and Access</Label>
                        {userProfile.roles.map((role, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{role.name}</CardTitle>
                                    <CardDescription>{role.access}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="secretKey">Secret Key</Label>
                        <div className="flex">
                            <Input
                                id="secretKey"
                                type={showSecretKey ? "text" : "password"}
                                value={userProfile.secretKey}
                                readOnly
                                className="flex-grow"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowSecretKey(!showSecretKey)}
                                className="ml-2"
                            >
                                {showSecretKey ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
