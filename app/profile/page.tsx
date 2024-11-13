"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import {
  Copy,
  Check,
  Settings,
  Key,
  Activity,
  BarChart,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  ExternalLink,
  RefreshCw,
  User,
  CreditCard,
  Lock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";

// Mock data for the chart
const apiUsageData = [
  { name: "Jan", usage: 4000 },
  { name: "Feb", usage: 3000 },
  { name: "Mar", usage: 2000 },
  { name: "Apr", usage: 2780 },
  { name: "May", usage: 1890 },
  { name: "Jun", usage: 2390 },
  { name: "Jul", usage: 3490 },
];

const ActivityItem = ({ icon, action, date, description }) => (
  <motion.li
    className="flex items-center space-x-4 py-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600/20 text-purple-600">
      {icon}
    </span>
    <div className="flex-1 space-y-1">
      <p className="font-medium text-zinc-100">{action}</p>
      <p className="text-sm text-zinc-400">{description}</p>
      <p className="text-xs text-zinc-500">{date}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-zinc-500" />
  </motion.li>
);

const ApiKeyCard = ({ apiKey, onCopy, onRegenerate, copied }) => (
  <>
    <Card className="bg-zinc-900 border-zinc-800 col-span-2">
      <CardHeader>
        <CardTitle className="text-zinc-100">API Key</CardTitle>
        <CardDescription className="text-zinc-400">
          Your API key for authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input
            id="api-key"
            name="api-key"
            type="text"
            value={apiKey}
            readOnly
            className="pr-20 bg-zinc-800 border-zinc-700 text-zinc-100"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-zinc-100"
              onClick={onCopy}
              aria-label="Copy API key"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-zinc-100"
              onClick={onRegenerate}
              aria-label="Regenerate API key"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/docs/"
          className="text-purple-400 hover:text-purple-300 flex items-center"
        >
          View API Documentation
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  </>
);

const UsageChart = ({ data }) => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardHeader>
      <CardTitle className="text-zinc-100">API Usage</CardTitle>
      <CardDescription className="text-zinc-400">
        Your API usage over time
      </CardDescription>
    </CardHeader>
    <CardContent className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
          <Line
            type="monotone"
            dataKey="usage"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const StatCard = ({ title, value, change, color }) => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardHeader>
      <CardTitle className="text-zinc-100">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-4xl font-bold ${color}`}>{value}</div>
      <p className="text-sm text-zinc-400">{change}</p>
    </CardContent>
  </Card>
);

const AccountStatusCard = () => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardHeader>
      <CardTitle className="text-zinc-100">Account Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-2">
        <motion.div
          className="h-3 w-3 rounded-full bg-green-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <div className="text-2xl font-bold text-green-500">Active</div>
      </div>
      <p className="mt-2 text-sm text-zinc-400">Pro Plan</p>
      <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white">
        Upgrade Plan
      </Button>
    </CardContent>
  </Card>
);

export default function Profile() {
  const [apiKey, setApiKey] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [apiLimit, setApiLimit] = useState(50);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const router = useRouter();
  const { user, updateProfile, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else {
      setName(user.name || "");
      setApiKey(user.apiKey || "");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ name });
      setIsLoading(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const regenerateApiKey = () => {
    setApiKey(`new-api-key-${Math.random().toString(36).substr(2, 9)}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-50 px-4 py-24 sm:px-6 lg:px-8 `}
    >
      <Header />
      <motion.div
        className="container mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between">
          <motion.div
            className="flex items-center space-x-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Avatar className="h-20 w-20 ring-2 ring-purple-600">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name?.charAt(0) || user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <motion.h1
                className="text-3xl font-bold text-zinc-50"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {user.name}
              </motion.h1>
              <p className="text-zinc-400">{user.email}</p>
            </div>
          </motion.div>
          <motion.div
            className="mt-4 sm:mt-0 space-x-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-800 text-zinc-200 border-zinc-700">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/billing")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 md:grid-cols-4 md:grid-rows-2"
            >
              <ApiKeyCard
                apiKey={apiKey}
                onCopy={copyToClipboard}
                onRegenerate={regenerateApiKey}
                copied={copied}
              />
              <UsageChart data={apiUsageData} />
              <StatCard
                title="Active Users"
                value="1,234"
                change="+15.3% from last month"
                color="text-purple-600"
              />
              <AccountStatusCard />
            </motion.div>
          </TabsContent>

          <TabsContent value="activity">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Your latest actions and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-zinc-800">
                    <ActivityItem
                      icon={<Key className="h-5 w-5" />}
                      action="API Key Generated"
                      description="A new API key was created for your account"
                      date="2023-04-01 14:30"
                    />
                    <ActivityItem
                      icon={<Settings className="h-5 w-5" />}
                      action="Profile Updated"
                      description="Your profile information was updated"
                      date="2023-03-28 09:15"
                    />
                    <ActivityItem
                      icon={<Activity className="h-5 w-5" />}
                      action="New Integration Added"
                      description="You added a new integration to your account"
                      date="2023-03-25 11:45"
                    />
                    <ActivityItem
                      icon={<BarChart className="h-5 w-5" />}
                      action="Billing Cycle Renewed"
                      description="Your monthly billing cycle has been renewed"
                      date="2023-03-01 00:01"
                    />
                    {showAllActivity && (
                      <>
                        <ActivityItem
                          icon={<User className="h-5 w-5" />}
                          action="New Team Member Added"
                          description="A new member was added to your team"
                          date="2023-02-15 10:30"
                        />
                        <ActivityItem
                          icon={<Lock className="h-5 w-5" />}
                          action="Security Settings Updated"
                          description="Your account security settings were modified"
                          date="2023-02-10 16:45"
                        />
                      </>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAllActivity(!showAllActivity)}
                  >
                    {showAllActivity ? "Show Less" : "View All Activity"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-zinc-100">
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-zinc-200">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-zinc-200">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-100"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label
                          htmlFor="notifications"
                          className="text-zinc-200"
                        >
                          Notifications
                        </Label>
                        <span className="text-sm text-zinc-400">
                          Receive email notifications
                        </span>
                      </div>
                      <Switch
                        id="notifications"
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="two-factor" className="text-zinc-200">
                          Two-Factor Authentication
                        </Label>
                        <span className="text-sm text-zinc-400">
                          Enable 2FA for added security
                        </span>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={twoFactor}
                        onCheckedChange={setTwoFactor}
                      />
                    </div>
                    <div>
                      <Label htmlFor="api-limit" className="text-zinc-200">
                        API Request Limit
                      </Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="api-limit"
                          min={10}
                          max={100}
                          step={10}
                          value={[apiLimit]}
                          onValueChange={(value) => setApiLimit(value[0])}
                          className="flex-1"
                        />
                        <span className="text-zinc-200 font-medium">
                          {apiLimit}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="h-5 w-5 border-t-2 border-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-zinc-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
