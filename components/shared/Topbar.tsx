"use client";

import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import LoginButton from "./LoginButton";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getWeb3, initWeb3 } from "@/app/services/web3";
import SocialWeb3 from "../socialWeb3.json";

function Topbar() {
  const [account, setAccount] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<number[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number>();
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
            const contract = await new web3.eth.Contract(
              SocialWeb3.abi,
              "0x03E97C93e5e17817bd3253C6312D2610844430C3"
            );

            const tx = await contract.methods
              .getUserProfiles(accounts[0])
              .call();
            if (Array.isArray(tx)) {
              const result = tx.map((profileId) => Number(profileId));
              setProfiles(result);
            }
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
          <div
            style={{
              width: "22rem",
              display: "flex",
              flexFlow: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "white", paddingRight: "2rem" }}>
              {account && `${account.substring(0, 4)}...${account.slice(-4)}`}
            </span>
            <div
              className="custom-select"
              style={{
                width: "17rem",
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "white" }}>Profile</span>
              <select
                style={{
                  backgroundColor: "#121417",
                  color: "white",
                  padding: "0.7rem",
                }}
                onChange={(e) => {
                  const selectedProfile = parseInt(e.target.value);
                  setSelectedProfile(selectedProfile);
                }}
                value={selectedProfile || ""}
              >
                {profiles.map((profileId) => (
                  <option key={profileId} value={profileId}>
                    {profileId}
                  </option>
                ))}
              </select>

              <Button style={{ marginLeft: "1rem" }}>
                <Link href="/onboarding">Create Profile</Link>
              </Button>
            </div>
          </div>
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
