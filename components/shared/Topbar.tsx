"use client";

import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import LoginButton from "./LoginButton";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getWeb3, initWeb3 } from "@/app/services/web3";
function Topbar() {
  const [account, setAccount] = useState<string | null>(null);
  const handleGetAccount = useCallback(async () => {
    try {
      {
        initWeb3();
        const web3 = getWeb3();
        if (web3) {
          const accounts = await web3.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            const connectedAccount = accounts[0];
            setAccount(connectedAccount);
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, []);
  useEffect(() => {
    handleGetAccount();
  }, []);
  return (
    <nav className="topbar">
      <Link href="/" className="flex item-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block ">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        {!account ? (
          <LoginButton setAccount={setAccount} />
        ) : (
          <React.Fragment>
            <span style={{ color: "white", paddingRight: "1rem" }}>
              {account && `${account.substring(0, 4)}...${account.slice(-4)}`}
            </span>
            <Button>
              <Link href="/onboarding">Create Profile</Link>
            </Button>
          </React.Fragment>
        )}

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
