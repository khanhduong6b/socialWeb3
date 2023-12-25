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
  const [handles, setHandles] = useState<string[]>([]);
  const [profilesIds, setProfilesIds] = useState<number[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number>(0);
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
              process.env.SOCIALWEB3_ADDRESS
            );

            const tx = await contract.methods // @ts-ignore
              .getUserProfiles(accounts[0])
              .call();
            if (Array.isArray(tx)) {
              const result = tx.map((profileId) => Number(profileId));
              setProfilesIds(result);
              setSelectedProfileId(result[0]);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, []);
  const handleGetProfile = useCallback(async () => {
    if (selectedProfileId <= 0) return;
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
              process.env.SOCIALWEB3_ADDRESS
            );

            const tx: any = await contract.methods // @ts-ignore
              .getProfileNFTData(selectedProfileId)
              .call();
            if (
              tx &&
              sessionStorage.getItem("profile") &&
              sessionStorage.getItem("id")
            ) {
              sessionStorage.removeItem("profile");
              sessionStorage.removeItem("id");
              sessionStorage.setItem("id", selectedProfileId + "");
              sessionStorage.setItem("profile", JSON.stringify(tx));
            } else {
              sessionStorage.setItem("id", selectedProfileId + "");
              sessionStorage.setItem("profile", JSON.stringify(tx));
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, [selectedProfileId]);
  const handleGetHandles = useCallback(async () => {
    if (!account) return;
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
              process.env.SOCIALWEB3_ADDRESS
            );
            const tx: any = await contract.methods // @ts-ignore
              .getUserHandles(account)
              .call();
            setHandles(tx);
          }
        }
      }
    } catch (error: any) {
      console.error("Error while logging in:", error.message);
    }
  }, [account]);
  useEffect(() => {
    handleGetAccount();
    handleGetHandles();
  }, [account]);
  useEffect(() => {
    if (selectedProfileId > 0) handleGetProfile();
  }, [selectedProfileId]);
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
              minWidth: "25rem",
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
                minWidth: "20rem",
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {profilesIds.length > 0 ? (
                <React.Fragment>
                  <select
                    style={{
                      backgroundColor: "#121417",
                      color: "white",
                      padding: "0.7rem",
                    }}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value);
                      setSelectedProfileId(selectedId);
                    }}
                    value={selectedProfileId || ""}
                  >
                    {profilesIds.map((profileId, index) => (
                      <option key={profileId} value={profileId}>
                        {handles[index]}
                      </option>
                    ))}
                  </select>
                </React.Fragment>
              ) : null}
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
