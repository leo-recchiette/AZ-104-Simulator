# HashiCorp Terraform Associate (004) - 167 domande con risposte

Generato dal PDF Examice. Campo `source`: `text_layer` = estratto dal testo del PDF; `manual_vision` = letto a mano dall'immagine. Gli esibiti che nel PDF sono testo sono stati ricostruiti come codice e resi come immagine. Il PDF non ha la spiegazione di 123 domande su 167: quelle sono scritte a parte (campo `explanation_source`: `written`) e marcate qui sotto.

---

## Domanda 1
*Tipo: multiple_choice · fonte: text_layer*

IaC (Infrastructure as Code) can be stored in a version control system along with application code.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** Infrastructure as Code is typically stored in version control systems alongside application code. This provides change history, collaboration, review workflows, and the ability to revert infrastructure changes when necessary. Keeping Terraform configuration in version control also helps teams reproduce consistent infrastructure across environments.

---

## Domanda 2
*Tipo: multiple_choice · fonte: text_layer*

It is best practice to store secret data in the same version control repository as your Terraform configuration.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Secret data should not be stored in the same version control repository as Terraform configuration because repositories often retain history, expose access to multiple contributors, and may be copied or forked. Credentials, API keys, and other sensitive values should instead be supplied through secure secret-management systems, protected CI/CD variables, or environment variables. Terraform configuration can reference those values without committing the secrets themselves.

---

## Domanda 3
*Tipo: multiple_choice · fonte: text_layer*

Which is an advantage of using IaC (Infrastructure as Code) that is not possible when provisioning with a GUI (Graphical User Interface)?

- **A.** Let's you version, reuse, and share infrastructure configuration. **← CORRETTA**
- **B.** Secures your credentials.
- **C.** Provisions the same resources at a lower cost.
- **D.** Prevents manual modifications to your resources.

**Risposta corretta:** A

**Spiegazione:** Infrastructure as Code stores infrastructure definitions in files, allowing them to be version controlled, reviewed, reused as modules, and shared across teams. This creates a repeatable record of how resources should be provisioned and makes consistent deployments easier. A GUI may help create resources interactively, but it does not inherently provide the same portable, versioned configuration workflow. IaC does not automatically secure credentials, reduce provider costs, or prevent all manual changes.

---

## Domanda 4
*Tipo: multiple_choice · fonte: text_layer*

What is an advantage of immutable infrastructure?

- **A.** Automatic infrastructure upgrades
- **B.** In-place infrastructure upgrades
- **C.** Quicker infrastructure upgrades
- **D.** Less complex infrastructure upgrades **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** Immutable infrastructure replaces existing resources with new, consistently defined versions instead of modifying them in place. This reduces configuration drift and avoids the uncertainty caused by accumulated manual changes or partial upgrades. Because deployments follow a repeatable replacement process, operational procedures and troubleshooting are generally less complex. In-place upgrades can preserve hidden differences between environments, making them harder to manage reliably.

---

## Domanda 5
*Tipo: multiple_choice · fonte: text_layer*

What is the primary purpose of IaC (Infrastructure as Code)?

- **A.** To define a pipeline to test and deliver software.
- **B.** To provision infrastructure cheaply.
- **C.** To programmatically create and configure resources. **← CORRETTA**
- **D.** To define a vendor-agnostic API.

**Risposta corretta:** C

**Spiegazione:** Infrastructure as Code enables infrastructure resources to be defined, created, and configured through machine-readable configuration files. This makes infrastructure repeatable, version-controlled, and consistently deployable across environments. Although IaC can support lower costs and delivery pipelines, its primary function is programmatic infrastructure provisioning and configuration.

---

## Domanda 6
*Tipo: multiple_choice · fonte: text_layer*

Your team adopts an AWS CloudFormation as the standardized method for provisioning public cloud resources. Which scenario presents a challenge for your team?

- **A.** Deploying new infrastructure into Microsoft Azure. **← CORRETTA**
- **B.** Automating a manual, web console-based provisioning process.
- **C.** Building a reusable code base that can deploy resources into any AWS region.
- **D.** Managing a new application stack built on AWS-native services.

**Risposta corretta:** A

**Spiegazione:** Deploying infrastructure into Microsoft Azure is challenging because AWS CloudFormation is designed specifically to define and provision AWS resources. Its templates use AWS resource types and AWS service integrations, so they do not provide native support for Azure infrastructure. CloudFormation can automate console-based AWS provisioning, deploy reusable templates across AWS Regions, and manage stacks built from AWS-native services.

---

## Domanda 7
*Tipo: multiple_choice · fonte: text_layer*

Which is not a benefit of adopting IaC (Infrastructure as Code)?

- **A.** Reusability of code
- **B.** Automation
- **C.** A GUI (Graphical User Interface) **← CORRETTA**
- **D.** Versioning

**Risposta corretta:** C

**Spiegazione:** A graphical user interface is not an inherent benefit of Infrastructure as Code. IaC defines and manages infrastructure through declarative or programmatic configuration files, enabling automation, repeatable deployments, and reusable modules. Because the configuration is stored as code, it can also be versioned and reviewed through source control systems. A GUI may be used alongside IaC tools, but it is not a core IaC advantage.

---

## Domanda 8
*Tipo: multiple_choice · fonte: text_layer*

How does the use of Infrastructure as Code (IaC) enhance the reliability of your infrastructure? (Choose two.)

- **A.** Configuration drift is reduced with declarative definitions. **← CORRETTA**
- **B.** Updates are deployed with zero downtime.
- **C.** Proposed changes can be reviewed before being applied. **← CORRETTA**
- **D.** Incorrect configurations cannot be deployed.
- **E.** Infrastructure is automatically scaled to meet demand.

**Risposta corretta:** A, C

**Spiegazione:** Declarative infrastructure definitions reduce configuration drift by making the desired state explicit, repeatable, and consistently applied across environments. IaC also produces plans or proposed changes that can be reviewed before execution, allowing teams to detect unintended modifications and apply approval processes. IaC does not inherently guarantee zero-downtime updates, prevent all incorrect configurations, or automatically scale infrastructure.

---

## Domanda 9
*Tipo: multiple_choice · fonte: text_layer*

Your team often uses API calls to create and manage cloud infrastructure. In what ways does Terraform differ from conventional infrastructure management approaches?

- **A.** Terraform replaces cloud provider APIs with its own protocols, enabling automated deployments.
- **B.** Terraform describes infrastructure with version-controlled, repeatable configurations that specify the desired state. **← CORRETTA**
- **C.** Terraform is merely a wrapper for cloud provider APIs, so there is little to no difference in calling the API directly.
- **D.** Terraform enforces infrastructure through imperative scripts to ensure tasks are completed in the proper order.

**Risposta corretta:** B

**Spiegazione:** Terraform describes the desired infrastructure state in declarative configuration files, which can be stored in version control and reused consistently across environments. It compares that configuration with the current state and determines the changes needed to reach the intended result. Unlike imperative scripts or direct API calls, users define what infrastructure should exist rather than manually specifying each API operation and its order.

---

## Domanda 10
*Tipo: multiple_choice · fonte: text_layer*

Which of these workflows is only enabled by the use of Infrastructure as Code?

- **A.** Automatic scaling of resources based on application load.
- **B.** Cost optimization of infrastructure deployment.
- **C.** Role-based access control of cloud resources.
- **D.** Reviewing the proposed changes for potential security issues. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** Reviewing proposed infrastructure changes for potential security issues is enabled by expressing infrastructure as version-controlled code. Terraform plans can be generated before deployment and examined manually or by automated policy and security tools, allowing risks to be identified before resources are changed. Automatic scaling, cost optimization, and role-based access control can all be configured in cloud environments without Infrastructure as Code.

---

## Domanda 11
*Tipo: multiple_choice · fonte: text_layer*

What does Terraform use to deploy infrastructure for different cloud providers?

- **A.** Custom APIs developed by HashiCorp
- **B.** Vendors' CLI tools
- **C.** Vendors' UI
- **D.** Vendor-specific providers **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** Vendor-specific providers allow Terraform to interact with each cloud platform's API and manage its resources declaratively. A provider translates Terraform configuration into the API operations required by services such as AWS, Azure, Google Cloud, or Kubernetes. Terraform does not deploy infrastructure through vendor user interfaces or CLI tools; providers are the integration layer that supplies resource types, data sources, and authentication support.

---

## Domanda 12
*Tipo: multiple_choice · fonte: text_layer*

How can you enable verbose logging to troubleshoot?

- **A.** Set the log level command line flag.
- **B.** Set the TF_LOG environment variable. **← CORRETTA**
- **C.** Set the log level in your terraform block.

**Risposta corretta:** B

**Spiegazione:** Setting the TF_LOG environment variable enables Terraform's internal logging for troubleshooting. Its value controls the verbosity level, such as TRACE, DEBUG, INFO, WARN, or ERROR, with TRACE providing the most detailed diagnostic output. Terraform does not use a general log-level command-line flag or a terraform block setting for this purpose.

---

## Domanda 13
*Tipo: multiple_choice · fonte: text_layer*

Which command lets you experiment with Terraform expressions?

- **A.** terraform console **← CORRETTA**
- **B.** terraform env
- **C.** terraform validate
- **D.** terraform test

**Risposta corretta:** A

**Spiegazione:** terraform console opens an interactive command-line console for evaluating Terraform expressions. It lets users test functions, inspect values, and experiment with expression syntax without applying infrastructure changes. terraform validate checks configuration syntax and internal consistency, while terraform test runs defined test files rather than providing an interactive expression environment.

---

## Domanda 14
*Tipo: multiple_choice · fonte: text_layer*

You can install Community/Partner plugins using terraform init.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** terraform init initializes a working directory and installs the provider plugins required by its configuration. Community and Partner providers are distributed through the Terraform Registry or configured provider sources, so Terraform can download them during initialization. This allows the configuration to use providers beyond the official HashiCorp-maintained set.

---

## Domanda 15
*Tipo: multiple_choice · fonte: text_layer*

What functionality do providers offer in Terraform? (Choose three.)

- **A.** Group a collection of Terraform configuration files that map to a single state file.
- **B.** Provision resources for public cloud infrastructure services. **← CORRETTA**
- **C.** Interact with cloud provider APIs. **← CORRETTA**
- **D.** Enforce security and compliance policies.
- **E.** Provision resources for on-premises infrastructure services. **← CORRETTA**

**Risposta corretta:** B, C, E

**Spiegazione:** Providers are plugins that let Terraform communicate with external APIs and manage infrastructure resources. They commonly provision public cloud services, such as compute, networking, and storage, and can also manage on-premises platforms and services. Through provider APIs, Terraform translates resource configuration into create, read, update, and delete operations. Grouping configuration files and state is handled by modules and state management, while policy enforcement is provided by tools such as Sentinel rather than providers.

---

## Domanda 16
*Tipo: multiple_choice · fonte: text_layer*

Terraform can only manage resource dependencies if you set them explicitly with the depends_on argument.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Terraform automatically infers many dependencies when one resource references an attribute from another resource. For example, using a virtual network ID in a subnet configuration causes Terraform to create the network before the subnet. The depends_on argument is only needed when a dependency exists but cannot be expressed through a direct attribute reference.

---

## Domanda 17
*Tipo: multiple_choice · fonte: text_layer*

Which of the following is not a valid Terraform collection type?

- **A.** set
- **B.** list
- **C.** map
- **D.** tree **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A tree is not a Terraform collection type. Terraform supports lists, sets, and maps for grouping multiple values, each with different ordering and key behavior. Lists preserve order, sets contain unique unordered elements, and maps store values associated with string keys. Hierarchical data must instead be modeled by nesting supported collection and object types.

---

## Domanda 18
*Tipo: multiple_choice · fonte: text_layer*

A resource block is shown in the Exhibit space of this page. What is the provider for this resource?

- **A.** main
- **B.** vpc
- **C.** aws **← CORRETTA**
- **D.** test

**Risposta corretta:** C
> Esibito: q018_pre0.png

**Spiegazione:** The aws prefix in the resource type aws_vpc identifies the provider responsible for managing the resource. Terraform resource types use the format provider_resource_type, so aws is the provider and vpc is the AWS resource type. The label main is only the local name used to reference this particular VPC instance within the Terraform configuration.

---

## Domanda 19
*Tipo: multiple_choice · fonte: text_layer*

You must use different Terraform commands depending on the cloud provider you use.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Terraform uses the same core workflow and commands regardless of the cloud provider. Commands such as terraform init, plan, apply, and destroy operate on Terraform configuration and state, while provider plugins translate the requested resource operations into provider-specific API calls. A configuration may use AWS, Azure, Google Cloud, or another provider without requiring different Terraform commands.

---

## Domanda 20
*Tipo: multiple_choice · fonte: text_layer*

Terraform providers are always installed from the internet.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Terraform providers can be installed from sources other than the public internet. Terraform supports local filesystem mirrors, network mirrors, provider caches, and private registries such as the Terraform Cloud private registry. These options allow organizations to control provider distribution, support offline environments, and meet security or compliance requirements.

---

## Domanda 21
*Tipo: multiple_choice · fonte: text_layer*

You need to determine from which paths Terraform is loading the providers referenced in your *.tf files. How can you enable additional logging to see this information?

- **A.** Set the environment variable TF_VAR_log=TRACE.
- **B.** Set the environment variable TF_LOG=TRACE. **← CORRETTA**
- **C.** Set the environment variable TF_LOG=PATH.
- **D.** Set verbose logging for each provider in your Terraform configuration.

**Risposta corretta:** B

**Spiegazione:** Setting the TF_LOG environment variable to TRACE enables Terraform's most detailed diagnostic logging. At this level, Terraform reports provider discovery and installation activity, including the filesystem paths and registry locations it checks when resolving provider requirements. TF_VAR_log only defines an input variable named log and does not control Terraform logging. Provider-specific configuration is not required to view Terraform's provider-loading process.

---

## Domanda 22
*Tipo: multiple_choice · fonte: text_layer*

Terraform requires using a different provider for each cloud provider where you want to deploy resources.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** Terraform uses providers as plugins that define how it communicates with specific infrastructure platforms and services. Each cloud provider, such as AWS, Azure, or Google Cloud, has its own provider because its APIs, resource types, and authentication methods differ. A configuration deploying resources across multiple clouds therefore declares and configures the appropriate provider for each platform.

---

## Domanda 23
*Tipo: multiple_choice · fonte: text_layer*

Terraform cannot use a newly-defined cloud backend until it has been initialized with terraform init.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** A newly defined cloud backend becomes active only after terraform init initializes the working directory. Initialization configures the backend, establishes where Terraform stores and retrieves state, and may migrate existing local state if required. Until this step is completed, Terraform cannot use the backend for state operations.

---

## Domanda 24
*Tipo: multiple_choice · fonte: text_layer*

You have a list of numbers that represents the number of free CPU cores on each virtual cluster: numcpus = [ 18, 3, 7, 11, 2] What Terraform built-in function would you use to select the largest number from the list?

- **A.** top(numcpus)
- **B.** max(numcpus) **← CORRETTA**
- **C.** ceil(numcpus)
- **D.** high[numcpus]

**Risposta corretta:** B

**Spiegazione:** The max function returns the greatest value among the numbers provided, so it selects 18 from this collection of available CPU core counts. In Terraform, the list is expanded as arguments when calling the function, such as max(numcpus...). The ceil function rounds a single numeric value upward and does not compare list elements, while top and high are not Terraform built-in functions.

---

## Domanda 25
*Tipo: multiple_choice · fonte: text_layer*

Which of these is stored in the .terraform directory?

- **A.** Providers and modules **← CORRETTA**
- **B.** Lock file
- **C.** State file
- **D.** Configuration files

**Risposta corretta:** A

**Spiegazione:** Providers and modules downloaded during Terraform initialization are stored in the .terraform directory. Terraform uses this directory to keep the working directory's installed dependencies and initialization metadata, allowing subsequent commands to use the selected provider versions and module packages. The dependency lock file is normally stored as .terraform.lock.hcl in the root configuration directory, while state and configuration files are kept separately.

---

## Domanda 26
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A variable block is shown in the Exhibit space on this page: You will use this variable as the value for the tags argument in several resources. The data format must be a set of key value pairs. Which type argument would you use?

- **A.** type = map(string) **← CORRETTA**
- **B.** type = any
- **C.** type = list(string)
- **D.** type = object({ tags = string})

**Risposta corretta:** A
> Esibito: q026_pre0.png

**Spiegazione:** A map(string) is a collection of string values identified by string keys, which is exactly the key/value shape expected by a tags argument. list(string) is an ordered sequence without keys, any disables type checking and would accept values that are not key/value pairs, and object({ tags = string }) describes an object with a single attribute named tags rather than an arbitrary set of keys.

---

## Domanda 27
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of the following is allowed as a Terraform variable name?

- **A.** name **← CORRETTA**
- **B.** source
- **C.** version
- **D.** count

**Risposta corretta:** A

**Spiegazione:** Terraform reserves some names because they are used as arguments in module blocks or as meta-arguments, so they cannot be used for input variables: source, version, providers, count, for_each, lifecycle, depends_on and locals. name is not reserved, so it is a valid variable name.

---

## Domanda 28
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Terraform providers are part of the Terraform core binary.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Providers are not part of the Terraform core binary: they are separate plugins, released and versioned independently. terraform init downloads the providers a configuration requires, usually from the Terraform Registry, and installs them in the .terraform directory.

---

## Domanda 29
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Where can Terraform not load a provider from?

- **A.** Provider plugin cache
- **B.** Source code **← CORRETTA**
- **C.** Official HashiCorp distribution on releases.hashicorp.com
- **D.** Plugins directory

**Risposta corretta:** B

**Spiegazione:** Terraform installs providers as pre-built plugin binaries: from a registry such as the Terraform Registry, from the official HashiCorp releases, from a local plugin cache, or from filesystem and network mirrors such as a plugins directory. It never compiles providers from source code; a provider built from source must first be compiled and placed in a location Terraform can load plugins from.

---

## Domanda 30
*Tipo: multiple_choice · fonte: manual_vision · spiegazione scritta a parte*

You are creating a Terraform configuration which needs to make use of multiple providers, one for AWS and one for Datadog. Which provider blocks would allow you to do this?

- **A.** provider "aws" { profile = var.aws_profile region = var.aws_region } provider "datadog" { api_key = var.datadog_api_key app_key = var.datadog_app_key } **← CORRETTA**
- **B.** provider { "aws" { profile = var.aws_profile region = var.aws_region } "datadog" { api_key = var.datadog_api_key app_key = var.datadog_app_key } }
- **C.** terraform { provider "aws" { profile = var.aws_profile region = var.aws_region } }
- **D.** terraform { provider "aws" { profile = var.aws_profile region = var.aws_region } provider "datadog" { api_key = var.datadog_api_key app_key = var.datadog_app_key } }

**Risposta corretta:** A
> Esibito: q030_pre0.png
> Nota: Nel PDF le quattro opzioni sono immagini di codice: qui sono trascritte su una riga, e l'esibito le mostra impaginate con le lettere A-D.

**Spiegazione:** Each provider is configured with its own top-level provider block whose label is the provider's local name, so a configuration that uses both AWS and Datadog declares provider "aws" and provider "datadog" separately. A single provider block cannot contain several providers, as in B, and provider blocks cannot be nested inside the terraform block, as in C and D: the terraform block holds settings such as required_providers, which declares provider sources and versions but does not configure them.

---

## Domanda 31
*Tipo: multiple_choice · fonte: text_layer*

You have developed a new service that runs on Azure and uses proprietary APIs. You want to use Terraform to create, manage, and delete users from the service. How can Terraform interact with the service?

- **A.** Terraform can manage users for any service that is hosted on a public cloud provider.
- **B.** Terraform cannot use proprietary APIs.
- **C.** Develop and publish a custom provider to interact with the service using its proprietary APIs. **← CORRETTA**
- **D.** Use the azurerm provider to leverage existing resource types.

**Risposta corretta:** C

**Spiegazione:** A custom Terraform provider enables Terraform to communicate with services that expose proprietary APIs. The provider defines the resource types and CRUD operations needed to create, read, update, and delete service users, translating Terraform configuration into API calls. The azurerm provider manages supported Azure resources, but it cannot manage arbitrary user objects in a separate proprietary service unless that functionality is implemented in a provider.

---

## Domanda 32
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

terraform init creates an example main.tf file in the current directory.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** terraform init initializes a working directory that already contains Terraform configuration: it configures the backend, installs the providers and downloads the modules. It never creates configuration files such as main.tf, which must be written beforehand.

---

## Domanda 33
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which command must you run before you run a plan or apply for the first time?

- **A.** terraform validate
- **B.** terraform workspace
- **C.** terraform import
- **D.** terraform init **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** terraform init must be run first in a new working directory, because plan and apply need the backend to be configured and the providers and modules to be installed. Validation also requires an initialized directory, while selecting a workspace or importing resources are not prerequisites for planning.

---

## Domanda 34
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

As a developer, you want to ensure your plugins are up-to-date with the latest versions. Which Terraform command should you use?

- **A.** terraform apply -upgrade
- **B.** terraform providers -upgrade
- **C.** terraform init -upgrade **← CORRETTA**
- **D.** terraform refresh -upgrade

**Risposta corretta:** C

**Spiegazione:** terraform init -upgrade ignores the versions recorded in the dependency lock file and installs the newest provider and module versions allowed by the configured version constraints. apply, providers and refresh do not install plugins and have no -upgrade option.

---

## Domanda 35
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What does terraform apply change after you approve the execution plan? (Choose two.)

- **A.** The state file **← CORRETTA**
- **B.** The cloud infrastructure **← CORRETTA**
- **C.** The execution plan
- **D.** The Terraform code
- **E.** The .terraform directory

**Risposta corretta:** A, B

**Spiegazione:** After the plan is approved, terraform apply calls the provider APIs to create, update or destroy the real infrastructure, and then records the result in the state file. It does not rewrite the configuration, it does not change the execution plan it is carrying out, and the .terraform directory is only managed by terraform init.

---

## Domanda 36
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You modified your local Terraform configuration and ran terraform plan to review the changes. Simultaneously, your teammate manually modified the infrastructure component you are working on. Since you already ran terraform plan locally, the execution plan for terraform apply will be the same.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** When terraform apply runs without a saved plan file, Terraform creates a new execution plan at that moment, refreshing the state against the real infrastructure first. The manual change made by the teammate is detected during that refresh, so the plan proposed by apply can differ from the one reviewed earlier with terraform plan.

---

## Domanda 37
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which is the correct workflow for deploying new infrastructure with Terraform?

- **A.** 1. Write Terraform configuration. 2. Run terraform apply to create infrastructure. 3. Use terraform validate to confirm Terraform deployed resources correctly.
- **B.** 1. Write Terraform configuration. 2. Run terraform init to initialize the working directory or workspace. 3. Run terraform apply. **← CORRETTA**
- **C.** 1. Write Terraform configuration. 2. Run terraform plan to initialize the working directory or workspace. 3. Run terraform apply to create the infrastructure.
- **D.** 1. Write Terraform configuration. 2. Run terraform show to view proposed changes. 3. Run terraform apply to create new infrastructure.

**Risposta corretta:** B

**Spiegazione:** The core workflow is write, init, plan and apply: after the configuration is written, terraform init prepares the working directory by installing providers and modules and configuring the backend, and terraform apply then creates the infrastructure, presenting the plan for approval first. terraform plan does not initialize the directory, terraform show only displays state or saved plans, and terraform validate checks the configuration, not the deployed resources.

---

## Domanda 38
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

After creating a new Terraform configuration, your config passes terraform validate but gives an "Access Denied" error from the cloud provider when running terraform plan. Why didn't validate catch this issue?

- **A.** The working directory was not initialized, so the cloud provider plugin wasn't available to use when running the terraform validate command.
- **B.** The remote backend wasn't configured, so terraform validate couldn't load the state and detect the missing credentials.
- **C.** terraform validate only checks if a configuration is syntactically correct and internally consistent, and does not communicate with providers. **← CORRETTA**
- **D.** Variables are only applied and validated during a terraform plan, so validate assumed defaults and returned the success message.

**Risposta corretta:** C

**Spiegazione:** terraform validate only checks that the configuration is syntactically valid and internally consistent, for example that attribute names and value types are correct. It does not contact any remote service, so it cannot detect missing permissions or invalid credentials: those errors appear only when terraform plan calls the provider APIs. Validation does require an initialized directory, so the provider plugin was available.

---

## Domanda 39
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Only the user that generated a terraform plan may apply it.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** A saved plan file can be applied by anyone who has the file and the access needed to run Terraform against the same configuration and state; it is not tied to the user who created it. In automation, one job often runs terraform plan -out and a later job, possibly with a different identity, applies that plan.

---

## Domanda 40
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

terraform apply will fail if you have not run terraform plan first to update the plan output.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** terraform apply does not require a previous terraform plan: when no saved plan file is given, it creates a new execution plan itself and asks for approval before making changes. Running terraform plan first is useful for review, but it is not mandatory.

---

## Domanda 41
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What's the proper syntax for the plan command?

- **A.** terraform plan -generate-config-out=tfplan
- **B.** terraform plan -target=tfplan
- **C.** terraform plan -out=tfplan **← CORRETTA**
- **D.** terraform plan -var-file=tfplan

**Risposta corretta:** C

**Spiegazione:** The -out option saves the execution plan to a file, here tfplan, which terraform apply tfplan can later carry out exactly. -generate-config-out writes HCL for resources being imported, -target restricts planning to specific resource addresses, and -var-file loads variable values from a file.

---

## Domanda 42
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which is true about terraform apply? (Choose two.)

- **A.** It only operates on infrastructure defined in the current working directory or workspace. **← CORRETTA**
- **B.** You cannot target specific resources for the operation.
- **C.** Depending on provider specification, Terraform may need to destroy and recreate your infrastructure resources. **← CORRETTA**
- **D.** You must pass the output of a terraform plan command to it.
- **E.** By default, it does not refresh your state file to reflect the current infrastructure configuration.

**Risposta corretta:** A, C

**Spiegazione:** terraform apply works on the configuration in the current working directory and on the state of the selected workspace. Depending on how the provider defines a resource, some changes cannot be made in place, so Terraform destroys and recreates the resource. Specific resources can be targeted with -target, a saved plan is optional, and apply refreshes the state by default before planning.

---

## Domanda 43
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which syntax check returns an error when you run terraform validate?

- **A.** None of these will return an error.
- **B.** There is a missing variable block. **← CORRETTA**
- **C.** The state file does not match the current infrastructure.
- **D.** The code contains tabs for indentation instead of spaces.

**Risposta corretta:** B

**Spiegazione:** Referencing a variable that has no variable block, such as var.region without a matching declaration, is an internal consistency error that terraform validate reports. Validate never compares the state with the real infrastructure, and indenting with tabs is a style issue that terraform fmt fixes, not a validation error.

---

## Domanda 44
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What is the purpose of the .terraform directory in a Terraform workspace?

- **A.** The directory contains plugins and modules that Terraform downloads during initialization, along with other important information. **← CORRETTA**
- **B.** The directory contains the provide credentials and the .tfvars files to prevent them from being committed to version control by accident.
- **C.** The directory is where Terraform creates and maintains the state file to track the underlying resources it creates and manages.
- **D.** The directory is used to convert and store Terraform configuration files into API calls to communicate with the targeted platform.

**Risposta corretta:** A

**Spiegazione:** The .terraform directory is created by terraform init in the working directory. It holds the provider plugins and modules Terraform downloaded, together with other data such as the backend configuration in use and the selected workspace. The local state file is stored outside it, in terraform.tfstate, and credentials or .tfvars files are not kept there.

---

## Domanda 45
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

How can terraform plan aid in the development process?

- **A.** Validates your expectations against the execution plan without permanently modifying state. **← CORRETTA**
- **B.** Reconciles Terraform's state against deploys resources and permanently modifies state using the current status of deployed resources.
- **C.** Initializes your working directory containing your Terraform configuration files.
- **D.** Formats your Terraform configuration files.

**Risposta corretta:** A

**Spiegazione:** terraform plan compares the configuration with the current state and the real infrastructure and shows the actions Terraform would take, so you can check them against your expectations without changing any resource or persisting the state. Reconciling the state with deployed resources is the job of refresh-only mode, initialization is done by terraform init and formatting by terraform fmt.

---

## Domanda 46
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You have a saved execution plan containing desired changes for infrastructure managed by Terraform. After running the command `terraform apply my.tfplan`, you receive the error shown in the Exhibit space on this page. How can you apply the desired changes? (Choose two.)

- **A.** Generate a new execution plan file with terraform plan, and apply the new plan. **← CORRETTA**
- **B.** Run terraform apply without the saved execution plan. **← CORRETTA**
- **C.** Refresh the current state data using the -refresh-only flag.
- **D.** Force the apply command by adding the flag -lock=false.
- **E.** Update the current plan file using the terraform state push command.

**Risposta corretta:** A, B
> Esibito: q046_pre0.png

**Spiegazione:** Terraform rejects a saved plan once the state has changed after the plan was created, because the plan was computed from an outdated snapshot. You can either create a fresh plan file with terraform plan and apply it, or run terraform apply without a plan file so that Terraform plans again against the current state. A refresh-only operation, disabling locking or pushing state do not make the stale plan valid again.

---

## Domanda 47
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of these can you do with terraform plan? (Choose two.)

- **A.** Schedule Terraform to run at a planned time in the future.
- **B.** View the execution plan and check if the changes match your expectations. **← CORRETTA**
- **C.** Execute a plan in a different workspace.
- **D.** Save a generated execution plan to apply later. **← CORRETTA**

**Risposta corretta:** B, D

**Spiegazione:** terraform plan shows the execution plan so you can check that the proposed changes match your expectations, and with -out it saves the plan to a file that terraform apply can carry out later. It has no scheduling feature, and it always works on the currently selected workspace rather than executing a plan in another one.

---

## Domanda 48
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which task does terraform init not perform?

- **A.** Sources any remote modules and downloads them.
- **B.** Connects to the configured backend.
- **C.** Validates that values are set for all required input variables. **← CORRETTA**
- **D.** Sources all providers used in the configuration and downloads them.

**Risposta corretta:** C

**Spiegazione:** terraform init configures the backend, downloads the modules and installs the providers the configuration needs. It does not check whether required input variables have values: that happens when Terraform evaluates the configuration during plan or apply.

---

## Domanda 49
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

terraform init retrieves and caches the configuration for all remote modules.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** During initialization, terraform init downloads the source of every module called from a remote location, such as the Terraform Registry or a Git repository, into the .terraform/modules directory. Later commands use these local copies until the modules are updated again with terraform init or terraform get.

---

## Domanda 50
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You just upgraded the version of a provider in an existing Terraform configuration. What will install the new provider?

- **A.** Run terraform plan.
- **B.** Run terraform apply.
- **C.** Run terraform init -upgrade. **← CORRETTA**
- **D.** Run terraform refresh.

**Risposta corretta:** C

**Spiegazione:** Provider versions are selected and installed only by terraform init. After raising a version constraint, terraform init -upgrade lets Terraform choose a version newer than the one recorded in the dependency lock file and install it; plan, apply and refresh only use the providers already installed.

---

## Domanda 51
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

terraform validate confirms the syntax of Terraform files.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** terraform validate checks that the configuration files are syntactically correct and internally consistent, for example that arguments and references are valid. It does not access any remote service or the state.

---

## Domanda 52
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A Terraform configuration is returning errors when running terraform plan. How would you enable debug logging to investigate further?

- **A.** Rerun terraform plan with the correct flag.
- **B.** Edit the client configuration file.
- **C.** Update the backend configuration.
- **D.** Set the correct environment variable. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** Terraform's detailed logs are enabled with the TF_LOG environment variable, set to a level such as DEBUG or TRACE, and TF_LOG_PATH can write them to a file. There is no command-line flag for it, and neither the CLI configuration file nor the backend configuration controls logging.

---

## Domanda 53
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Why would you use the -replace flag for terraform apply?

- **A.** You want to force Terraform to destroy a resource on the next apply.
- **B.** You want Terraform to ignore a resource on the next apply.
- **C.** You want Terraform to destroy all the infrastructure in your workspace.
- **D.** You want to force Terraform to destroy and recreate a resource on the next apply. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** terraform apply -replace=ADDRESS forces Terraform to plan the destruction and recreation of a specific resource instance, even when its configuration has not changed. It replaces the deprecated terraform taint command. It does not ignore a resource and does not destroy the whole workspace.

---

## Domanda 54
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

How does Terraform determine dependencies between resources when it creates an execution plan?

- **A.** Terraform builds a resource graph based on your configuration and your state file (if present). **← CORRETTA**
- **B.** Terraform requires resources in your configuration be listed in the order they will be created to determine dependencies.
- **C.** Terraform requires all dependencies between resources be specified using the depends_on parameter.
- **D.** Terraform requires resource dependencies be defined as modules and sourced in order.

**Risposta corretta:** A

**Spiegazione:** Terraform builds a dependency graph from the configuration, using the references between resources and any depends_on arguments, together with the state file when one exists. The order of blocks in the files does not matter, most dependencies are inferred automatically without depends_on, and modules are not needed to express dependencies.

---

## Domanda 55
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You create a main.tf Terraform configuration consisting of an application server, a database, and a load balancer. You run terraform apply and Terraform created all the resources successfully. Now you realize that you do not actually need the load balancer, so you run terraform destroy without any flags. What will happen?

- **A.** Terraform will prompt you to confirm that you want to destroy all the infrastructure. **← CORRETTA**
- **B.** Terraform will prompt you to pick which resource you want to destroy.
- **C.** Terraform will immediately destroy all the infrastructure.
- **D.** Terraform will destroy the application server because it is listed first in the code.
- **E.** Terraform will destroy the main.tf file.

**Risposta corretta:** A

**Spiegazione:** terraform destroy without options plans the destruction of every resource tracked in the current state and asks for interactive confirmation before doing anything. It does not offer a menu to pick resources and never deletes configuration files. To remove only the load balancer, you would delete its block from the configuration and apply, or use the -target option.

---

## Domanda 56
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You developed a new Terraform configuration for two virtual machines with a cloud provider. You're ready to create the infrastructure for the first time. Which Terraform command should you run first?

- **A.** terraform apply
- **B.** terraform plan
- **C.** terraform init **← CORRETTA**
- **D.** terraform show

**Risposta corretta:** C

**Spiegazione:** Before Terraform can plan or apply a new configuration, terraform init must initialize the working directory: it installs the cloud provider plugin, configures the backend and downloads any modules. Running plan or apply first fails because the required provider is not installed.

---

## Domanda 57
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When should you run terraform init?

- **A.** After you start coding a new Terraform project, and before you run terraform plan for the first time. **← CORRETTA**
- **B.** Every time you run terraform apply.
- **C.** Before you start coding a new Terraform project.
- **D.** After you run terraform plan for the first time in a new Terraform project, and before you run terraform apply.

**Risposta corretta:** A

**Spiegazione:** terraform init is run once the configuration declares the providers and modules it needs, and before the first plan. It has to be run again only after adding or changing providers, modules or the backend, not before every apply, and running it before any code exists has nothing to initialize.

---

## Domanda 58
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which configuration consistency error does terraform validate report?

- **A.** Declaring a resource identifier more than once. **← CORRETTA**
- **B.** Differences between local and remote state.
- **C.** An out-of-date module.
- **D.** A mix of spaces and tabs in configuration files.

**Risposta corretta:** A

**Spiegazione:** Declaring two resources with the same type and name makes the configuration internally inconsistent, so terraform validate reports a duplicate resource error. Validate never compares local and remote state, does not check whether modules are up to date, and mixing tabs and spaces is a formatting matter for terraform fmt.

---

## Domanda 59
*Tipo: multiple_choice · fonte: text_layer*

Which Terraform command checks that your configuration syntax is correct?

- **A.** terraform init
- **B.** terraform show
- **C.** terraform fmt
- **D.** terraform validate **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** terraform validate checks whether Terraform configuration files are syntactically valid and internally consistent. It evaluates the configuration without creating, modifying, or destroying infrastructure, making it useful before planning or applying changes. terraform fmt only reformats configuration files, while terraform init prepares the working directory and terraform show displays state or plan information.

---

## Domanda 60
*Tipo: multiple_choice · fonte: text_layer*

Which of the following is not an action performed by terraform init?

- **A.** Create template configuration files. **← CORRETTA**
- **B.** Retrieve the source code for all referenced modules.
- **C.** Initialize a configured backend.
- **D.** Load required provider plugins.

**Risposta corretta:** A

**Spiegazione:** Terraform init prepares an existing configuration directory for use by initializing the backend, downloading required provider plugins, and retrieving referenced module source code. It does not create Terraform configuration or template files; those files must already be written by the user or generated through separate tooling. Its purpose is to install and configure dependencies needed to run Terraform commands.

---

## Domanda 61
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of the following arguments are required when declaring a Terraform output?

- **A.** default
- **B.** value **← CORRETTA**
- **C.** description
- **D.** sensitive

**Risposta corretta:** B

**Spiegazione:** value is the only required argument of an output block: it is the expression whose result the output exposes. description and sensitive are optional, and default belongs to variable blocks, not to outputs.

---

## Domanda 62
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Outside of the required_providers block, Terraform configurations always refer to providers by their local names.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** In required_providers each provider is given a local name mapped to its source address, such as aws = { source = "hashicorp/aws" }. Everywhere else in the configuration, in provider blocks, resource type prefixes and provider meta-arguments, Terraform refers to the provider only by that local name.

---

## Domanda 63
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

The Exhibit section of this page shows part of a configuration you've been asked to update. The name of the Azure Virtual Network should be set to the name of the resource group followed by a dash and the word "vnet". Which expression fulfills this requirement?

- **A.** "${azurerm_resource_group.example.name}-vnet"
- **B.** join("-",var.resource_group_name,"vnet")
- **C.** concat(data.azurerm_resource_group.example.name, "-", "vnet")
- **D.** "${data.azurerm_resource_group.example.name}-vnet" **← CORRETTA**

**Risposta corretta:** D
> Esibito: q063_pre0.png

**Spiegazione:** The resource group comes from a data source, so the reference needs the data. prefix: data.azurerm_resource_group.example.name, followed by -vnet through string interpolation. Option A references a managed resource that does not exist in this configuration, join expects a separator followed by lists rather than individual strings, and concat joins lists, not strings.

---

## Domanda 64
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your team is collaborating on infrastructure using Terraform and are formatting their code to follow Terraform language style conventions. How can you update your code to meet these requirements?

- **A.** Run terraform validate prior to executing terraform plan or terraform apply.
- **B.** Replace all tabs with spaces within your Terraform configuration files.
- **C.** Terraform automatically formats configuration on terraform apply.
- **D.** Run terraform fmt to update your Terraform configurations. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** terraform fmt rewrites the configuration files in the current directory into the canonical format and style of the Terraform language, fixing indentation and aligning arguments. terraform validate checks correctness rather than style, replacing tabs alone does not cover the conventions, and terraform apply never reformats code.

---

## Domanda 65
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A resource block is shown in the Exhibit space of this page. How do you reference the name value of the second instance of this resource?

- **A.** aws_instance.web.*.name
- **B.** aws_instance.web[2].name
- **C.** element(aws_instance.web, 2)
- **D.** aws_instance.web[1].name **← CORRETTA**
- **E.** aws_instance.web[1]

**Risposta corretta:** D
> Esibito: q065_pre0.png

**Spiegazione:** With count, instances are indexed from zero, so the second instance is aws_instance.web[1] and its name is aws_instance.web[1].name. aws_instance.web[2] would be a third instance that does not exist, the splat expression returns the names of all instances, element(aws_instance.web, 2) wraps around to the first instance, and aws_instance.web[1] returns the whole object rather than its name.

---

## Domanda 66
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When using multiple configurations of the same Terraform provider, what meta-argument must you include in any non-default provider configurations?

- **A.** alias **← CORRETTA**
- **B.** name
- **C.** depends_on
- **D.** id

**Risposta corretta:** A

**Spiegazione:** Every additional configuration of the same provider must have an alias, such as alias = "west", so that resources can select it with provider = aws.west. The configuration without an alias is the default one, used by every resource that does not set the provider meta-argument.

---

## Domanda 67
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You want to create a string that is a combination of a generated random_id and a variable and reuse that string several times in your configuration. What is the simplest correct way to implement this without repeating the random_id and variable?

- **A.** Add an output value.
- **B.** Add a local value. **← CORRETTA**
- **C.** Use a data source.
- **D.** Use a module.

**Risposta corretta:** B

**Spiegazione:** A local value gives a name to an expression, so the combination of random_id and the variable is written once in a locals block and referenced as local.<name> wherever it is needed. An output exposes values outside the module, a data source reads external information, and a module would add unnecessary structure.

---

## Domanda 68
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your Terraform configuration manages a resource that requires maximum uptime. You need to update the resource, and when you run terraform plan, Terraform notes that the update requires the resource to be destroyed and recreated. Which lifecycle rule can you add to the resource to reduce the downtime of the resource while still applying the update?

- **A.** prevent_destroy = true
- **B.** destroy = false
- **C.** create_before_destroy = true **← CORRETTA**
- **D.** ignore_changes = all

**Risposta corretta:** C

**Spiegazione:** create_before_destroy = true makes Terraform create the replacement resource first and destroy the old one only afterwards, reducing downtime when a change forces replacement. prevent_destroy = true would make the plan fail instead of replacing the resource, ignore_changes = all would prevent the update entirely, and destroy is not a lifecycle argument.

---

## Domanda 69
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

The Terraform configuration shown in the Exhibit space on this page will create a new AWS instance.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B
> Esibito: q069_pre0.png

**Spiegazione:** The exhibit declares a data block, which only reads information about existing infrastructure: here it looks up an AWS instance whose Name tag is web. Data sources never create, update or destroy objects; creating an instance requires a resource "aws_instance" block.

---

## Domanda 70
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What kind of configuration block will manage an infrastructure object with settings specified within the block?

- **A.** data
- **B.** locals
- **C.** provider
- **D.** resource **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A resource block declares an infrastructure object, such as a virtual machine or a network, and the arguments inside the block specify its settings; Terraform creates and updates the object to match them. Data blocks only read existing information, locals give names to expressions and provider blocks configure the provider itself.

---

## Domanda 71
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You can execute `terraform fmt` to standardize all Terraform configurations within the current working directory to Terraform's canonical format and style.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** terraform fmt rewrites all Terraform configuration files in the current working directory into the canonical format and style. By default it does not descend into subdirectories; the -recursive option extends it to them.

---

## Domanda 72
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A data source is shown in the Exhibit space of this page. How do you reference the id attribute of this data source?

- **A.** data.aws_ami.web.id **← CORRETTA**
- **B.** web.id
- **C.** aws_ami.web.id
- **D.** data.web.id

**Risposta corretta:** A
> Esibito: q072_pre0.png

**Spiegazione:** Data sources are referenced with the data. prefix followed by the data source type and its name, so the id attribute is data.aws_ami.web.id. Without the prefix, aws_ami.web.id would refer to a managed resource, and a reference never omits the type.

---

## Domanda 73
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A resource block is shown in the Exhibit space of this page. How would you reference the attribute name of this resource in HCL?

- **A.** resource.kubernetes_namespace.example.name
- **B.** data.kubernetes_namespace.name
- **C.** kubernetes_namespace.example.name **← CORRETTA**
- **D.** kubernetes_namespace.test.name

**Risposta corretta:** C
> Esibito: q073_pre0.png

**Spiegazione:** A managed resource is referenced as <resource type>.<name>.<attribute>, so the name attribute is kubernetes_namespace.example.name. The resource keyword is not part of references, data. is only used for data sources, and test is the value of the attribute, not the name of the resource.

---

## Domanda 74
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You need to deploy resources into two different regions in the same Terraform configuration using the block in the Exhibit space on this page. What do you need to add to the provider configuration to deploy the resource to the us-west-2 AWS region?

- **A.** resource "aws_instance" "example-us-west-2" { ami = data.aws_ami.ubuntu.id instance_type = "t3.micro" }
- **B.** provider "aws" { region = "us-east-1" } provider "aws" "west" { region = "us-west-2" }
- **C.** provider "aws_west" { region = "us-west-2" }
- **D.** provider "aws" { region = "us-east-1" } provider "aws" { alias = "west" region = "us-west-2" } **← CORRETTA**

**Risposta corretta:** D
> Esibito: q074_pre0.png

**Spiegazione:** Two configurations of the same provider are allowed only if the additional one has an alias argument. Adding alias = "west" to the us-west-2 block lets resources select it with provider = aws.west, while the block without an alias remains the default for us-east-1. Provider blocks take a single label, so provider "aws" "west" is invalid, aws_west would be a different provider that does not exist, and a resource block alone does not choose the region.

---

## Domanda 75
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Two resources blocks are shown in the Exhibit space on this page: azurerm_linux_web_app, and azurerm_role_assignment. When provisioned, the web app will use the role assignment during creation, so the role assignment must be created first. How do you ensure the azurerm_role_assignment resource is created first?

- **A.** Add a depends_on argument to the azurerm_linux_web_app. **← CORRETTA**
- **B.** Change the order of the azurerm_linux_web_app and azurerm_role_assignment blocks.
- **C.** Add a create_before_destroy argument to the azurerm_role_assignment.
- **D.** Add a count argument to both resources.

**Risposta corretta:** A
> Esibito: q075_pre0.png, q075_pre1.png

**Spiegazione:** The web app does not reference any attribute of the role assignment, so Terraform cannot infer the dependency and could create both resources in parallel. Adding depends_on = [azurerm_role_assignment.kv_access] to the web app makes Terraform create the role assignment first. The order of blocks in the files is ignored, create_before_destroy only affects replacements, and count does not control ordering.

---

## Domanda 76
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A Terraform local value can reference other Terraform local values.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** Local values can reference other local values, as well as input variables, resource attributes and any other expression in the same module, as long as the references are not circular. This lets complex expressions be built step by step.

---

## Domanda 77
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You want to define multiple data disks as nested blocks inside the resource block for a virtual machine. What Terraform feature would help you define the blocks using the values in a variable?

- **A.** Count arguments
- **B.** Collection functions
- **C.** Local values
- **D.** Dynamic blocks **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A dynamic block generates repeated nested blocks, such as one data disk block per element, by iterating with for_each over a collection like a variable. count and collection functions cannot produce nested blocks, and local values only give names to expressions.

---

## Domanda 78
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You are creating a reusable Terraform configuration and want to include an optional billing_dept tag so your Finance team can track team-specific spending on resources. Which of the following billing_dept variable declarations will achieve this?

- **A.** variable "billing_dept" { default = "" } **← CORRETTA**
- **B.** variable "billing_dept" { type = optional(string) }
- **C.** variable "billing_dept" { optional = true }
- **D.** variable "billing_dept" { type = default }

**Risposta corretta:** A

**Spiegazione:** A variable becomes optional when it has a default value: with default = "" callers can omit billing_dept and the empty string is used. optional() is a type constraint modifier for object attributes, not for whole variables, and optional = true or type = default are not valid in a variable block.

---

## Domanda 79
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Part of a configuration is shown in the Exhibit space of this page. You want to pass the id of the vsphere_datacenter data source to the datacenter_id argument of the vsphere_folder resource. Which reference would you use?

- **A.** data.vsphere_datacenter.dc
- **B.** data.vsphere_datacenter.dc.id **← CORRETTA**
- **C.** vsphere_datacenter.dc.id
- **D.** data.dc.id

**Risposta corretta:** B
> Esibito: q079_pre0.png

**Spiegazione:** The datacenter ID comes from a data source, so the reference needs the data. prefix, the type, the name and the attribute: data.vsphere_datacenter.dc.id. Without .id the expression is the whole object, without data. it would refer to a managed resource, and the type can never be omitted.

---

## Domanda 80
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your Terraform configuration declares a variable, you want to enforce that its value meets your specific requirements, and you want to block the Terraform operation if it does not. What should you add to your configuration?

- **A.** Add a top-level check block.
- **B.** Add a validation block to the variable block. **← CORRETTA**
- **C.** Add a top-level validation block.
- **D.** Add a check block to the variable block.

**Risposta corretta:** B

**Spiegazione:** A validation block inside the variable block defines a condition and an error message: if the value does not meet the condition, Terraform reports the error and stops the operation. A check block only produces warnings without blocking anything, and validation is not a top-level block.

---

## Domanda 81
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Running terraform fmt without any flags in a directory with Terraform configuration files will check the formatting of those files, but will never change them.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** By default terraform fmt rewrites every file that is not in canonical format and lists the files it changed. Only with the -check option does it leave the files untouched and report through its exit code whether any file needs formatting.

---

## Domanda 82
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You want to retrieve the ID of an existing cloud resource for use in your Terraform configuration. Which block type would you use?

- **A.** resource
- **B.** import
- **C.** data **← CORRETTA**
- **D.** output

**Risposta corretta:** C

**Spiegazione:** A data block reads information about an existing object managed outside the configuration, such as its ID, and makes it available to the rest of the configuration. A resource block would create a new object, an import block brings an existing object under Terraform management, and an output only exposes values.

---

## Domanda 83
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of these commands makes your code more human-readable?

- **A.** terraform show
- **B.** terraform fmt **← CORRETTA**
- **C.** terraform output
- **D.** terraform validate

**Risposta corretta:** B

**Spiegazione:** terraform fmt rewrites configuration files in the canonical Terraform style, with consistent indentation and aligned equals signs, which makes the code easier to read. terraform show displays state or plans, terraform output prints output values and terraform validate checks correctness without changing the files.

---

## Domanda 84
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You want to split a large main.tf file into multiple files for better organization within the same working directory. What impact should you expect when you run a terraform plan?

- **A.** The terraform plan will fail since variable and provider blocks must appear before resource blocks.
- **B.** Significant changes should be expected since moving resources between files can trigger a destroy/replacement.
- **C.** No impact since Terraform reads all .tf files as a single configuration when executing a terraform plan. **← CORRETTA**
- **D.** Only minor impacts since Terraform parses the main.tf file first, which could change the order in which resources are created.

**Risposta corretta:** C

**Spiegazione:** Terraform loads every .tf file in the working directory and treats them as a single configuration: file names and the order of blocks do not matter. Moving blocks between files in the same directory does not change any resource address, so the plan shows no changes.

---

## Domanda 85
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You need to deploy resources into two different regions in the same Terraform configuration. To do this, you declare multiple provider configurations as shown in the Exhibit space on this page. What meta-argument do you need to configure in a resource block to deploy the resource to the us-west-2 AWS region?

- **A.** provider = west
- **B.** provider = aws.west **← CORRETTA**
- **C.** alias = aws.west
- **D.** alias = west

**Risposta corretta:** B
> Esibito: q085_pre0.png

**Spiegazione:** A resource selects a non-default provider configuration with the provider meta-argument, combining the provider's local name and the alias: provider = aws.west. alias is set only inside the provider block, and the bare alias west is not a valid reference.

---

## Domanda 86
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A resource block is shown in the Exhibit space on this page. What is the Terraform resource name of the resource block?

- **A.** test
- **B.** compute_instance
- **C.** google
- **D.** main **← CORRETTA**

**Risposta corretta:** D
> Esibito: q086_pre0.png

**Spiegazione:** In a resource block the first label is the resource type and the second is the local name: google_compute_instance is the type and main is the resource name used in references such as google_compute_instance.main. test is the value of the name argument, the instance name in the cloud, while google is the provider.

---

## Domanda 87
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A variable declaration is shown in the Exhibit space on this page. Which is the correct way to get the value of medium from this variable?

- **A.** var.sizes[0]
- **B.** var.sizes[1] **← CORRETTA**
- **C.** var.sizes[2]
- **D.** var.sizes[3]

**Risposta corretta:** B
> Esibito: q087_pre0.png

**Spiegazione:** Lists are indexed from zero, so in ["small", "medium", "large"] the value medium is at index 1: var.sizes[1]. Index 0 returns small, index 2 returns large and index 3 is out of range.

---

## Domanda 88
*Tipo: multiple_choice · fonte: text_layer*

You have declared a variable called var.list, which is a list of objects that all have an attribute id. Which expressions will evaluate to a list of the objectives' id attributes? (Choose two.)

- **A.** [ var.list[*].id ]
- **B.** [ for o in var.list : o.id ] **← CORRETTA**
- **C.** var.list[*].id **← CORRETTA**
- **D.** { for o in var.list : o => o.id }

**Risposta corretta:** B, C

**Spiegazione:** A for expression iterates over each object in var.list and returns its id attribute, producing a list of IDs. Terraform's splat expression, var.list[*].id, performs the same projection across every element of the list. Wrapping the splat expression in brackets creates a nested list instead. A map for expression uses object values as keys and produces a map rather than the required list.

---

## Domanda 89
*Tipo: multiple_choice · fonte: text_layer*

What type of block is used to construct a collection of nested configuration blocks?

- **A.** dynamic **← CORRETTA**
- **B.** nesting
- **C.** for_each
- **D.** repeated

**Risposta corretta:** A

**Spiegazione:** A dynamic block constructs repeated nested configuration blocks from a collection or expression. It is useful when the number or content of nested blocks is not known until Terraform evaluates the configuration. The for_each argument can be used inside a dynamic block to iterate over the collection, but it is not itself a block type for generating nested blocks.

---

## Domanda 90
*Tipo: multiple_choice · fonte: text_layer*

Which type of block fetches information from outside of Terraform, or computes data for use in a Terraform configuration?

- **A.** resource
- **B.** provider
- **C.** data **← CORRETTA**
- **D.** output

**Risposta corretta:** C

**Spiegazione:** A data block retrieves information from external systems or calculates values that Terraform can reference elsewhere in the configuration. Unlike a resource block, it does not create, modify, or destroy infrastructure. Data sources are commonly used to look up existing cloud resources, such as an existing VPC, image, or account details.

---

## Domanda 91
*Tipo: multiple_choice · fonte: text_layer*

Which option does not keep secret variable values out of Terraform configuration files?

- **A.** Pass the secret values as environment variables.
- **B.** Configure the variable as sensitive. **← CORRETTA**
- **C.** Pass the secret values via a -var flag.
- **D.** Store the secrets in a shared credential file.

**Risposta corretta:** B

**Spiegazione:** Marking a variable as sensitive only redacts its value from Terraform CLI output and some displays. It does not provide or store the secret value outside the configuration, and the value can still exist in state files or be supplied directly in code. Environment variables, -var command-line values, and shared credential files can keep secret values separate from Terraform configuration files.

---

## Domanda 92
*Tipo: multiple_choice · fonte: text_layer*

Which statements are true? (Choose two.)

- **A.** When a resource has a count meta-argument, Terraform evaluates the precondition for each instance. **← CORRETTA**
- **B.** A precondition in a resource block must pass for Terraform to create the resource. **← CORRETTA**
- **C.** A precondition cannot reference attributes of another resource that are only known after apply.
- **D.** A resource can either have a precondition or a postcondition. block, but not both.
- **E.** If a resource's postcondition block fails, Terraform still creates the resources that depend on it.

**Risposta corretta:** A, B

**Spiegazione:** A precondition attached to a resource is evaluated before Terraform performs that resource's planned action, so it must succeed before the resource can be created or updated. When the resource uses the count meta-argument, Terraform treats each counted instance separately and evaluates the precondition for every instance. Preconditions can depend on values that are unknown until apply, with evaluation deferred as needed. A resource may define both preconditions and postconditions, while a failed postcondition prevents dependent resources from proceeding.

---

## Domanda 93
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your configuration contains a module block that references a module from the Terraform registry, and sets the version argument to 1.0. You just published a new version of the module and updated your configuration to point to version 1.1. Which command must be run to install the new version?

- **A.** terraform apply
- **B.** terraform init **← CORRETTA**
- **C.** terraform plan
- **D.** terraform modules

**Risposta corretta:** B

**Spiegazione:** Module versions are installed by terraform init. After changing the version argument from 1.0 to 1.1, terraform init downloads the new version, while plan and apply stop with an error saying that the module must be installed first. terraform modules does not install modules.

---

## Domanda 94
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

If one of your modules uses a local value, you can expose that value to callers of the module by defining a terraform output in the module's configuration.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** Outputs can expose any value available in the module, local values included: an output whose value is local.<name> makes it accessible to the caller as module.<module name>.<output name>. Local values themselves are private to the module that declares them.

---

## Domanda 95
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

If a module declares a variable without a default value, you must pass the value of the variable within the module block when you call the module in your configuration.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** A variable without a default value is required, so every module block that calls the module must set it as an argument; otherwise Terraform reports a missing required argument. Variables with a default can be omitted.

---

## Domanda 96
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When you run `terraform apply`, the Terraform CLI will print output values from both the root module and any child modules.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** After an apply, the Terraform CLI prints only the outputs of the root module. Child module outputs are available to the calling module as module.<name>.<output>, and they appear in the CLI output only if the root module re-exports them with its own output blocks.

---

## Domanda 97
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which type of information does the Terraform Registry provide about the modules it hosts?

- **A.** Required input variables
- **B.** Outputs
- **C.** Optional input variables and default values
- **D.** All of these are provided **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** The Terraform Registry documents each module from its source: the required inputs, the optional inputs with their default values, the outputs, the resources it creates and its dependencies.

---

## Domanda 98
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When you include a module block in your configuration that references a module from the Terraform Registry, the version attribute is required.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** The version argument is recommended for registry modules, because it avoids unexpected changes when new versions are published, but it is optional: without it Terraform installs the latest available version.

---

## Domanda 99
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A child module can always access variables declared in its parent module.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Modules are isolated: a child module cannot read the variables of its parent. A value has to be passed explicitly as an argument of the module block, which sets the child module's input variable with the same name.

---

## Domanda 100
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You are updating a child module with the resource block shown in the Exhibit space on this page. The public_ip attribute of the resource needs to be accessible to the parent module. How do you meet this requirement?

- **A.** Add a data source to the parent module.
- **B.** Create a local value in the child module.
- **C.** Add an import block to the parent module.
- **D.** Create an output in the child module. **← CORRETTA**

**Risposta corretta:** D
> Esibito: q100_pre0.png

**Spiegazione:** A child module exposes values to its caller only through output blocks. Declaring output "public_ip" { value = aws_instance.example.public_ip } in the child module lets the parent reference module.<name>.public_ip. Local values are private to the module, and a data source or an import block in the parent would not expose the attribute.

---

## Domanda 101
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your configuration defines the module block shown in the Exhibit space on this page. The web_stack module accepts an input variable named servers. Which of the following changes to the module block sets the servers variable to the value of "3"?

- **A.** module "web_stack" { source = "./modules/web_stack" servers = 3 } **← CORRETTA**
- **B.** module "web_stack" { source = "./modules/web_stack" inputs.servers = 3 }
- **C.** module "web_stack" { source = "./modules/web_stack" inputs = { servers = 3 }
- **D.** module "web_stack" { source = "./modules/web_stack" var.servers = 3 }

**Risposta corretta:** A
> Esibito: q101_pre0.png

**Spiegazione:** Input variables of a child module are set as arguments directly in the module block, next to source, so servers = 3 sets the servers variable. Module blocks have no inputs argument or inputs. prefix, and var.servers is a reference, not an argument name.

---

## Domanda 102
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your team is using a version 3.1.4 of a module from the public Terraform Registry, and they're worried about possible breaking changes in future versions of the module. Which version argument should you add to the module block to prevent newer versions from being used?

- **A.** version = "3.1.4" **← CORRETTA**
- **B.** version = "< 3.2"
- **C.** version = "!=3.1.5"
- **D.** version = "~>3.1.4"

**Risposta corretta:** A

**Spiegazione:** version = "3.1.4" pins the exact version, so Terraform never selects a newer release. "< 3.2" and "~> 3.1.4" still allow newer patch versions such as 3.1.5, and "!= 3.1.5" excludes a single version while allowing all the other newer ones.

---

## Domanda 103
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of the following locations can Terraform use as a private source for modules? (Choose two.)

- **A.** Public repository on GitHub.
- **B.** Internally hosted VCS (Version Control System) platform. **← CORRETTA**
- **C.** Public Terraform Registry.
- **D.** Private repository on GitHub. **← CORRETTA**

**Risposta corretta:** B, D

**Spiegazione:** Private module sources are locations that only authorized users can reach, such as an internally hosted VCS platform or a private GitHub repository accessed with credentials. Public GitHub repositories and the public Terraform Registry are public sources; for private registry hosting, HCP Terraform offers a private registry.

---

## Domanda 104
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your configuration defines the module block shown in the Exhibit space on this page. This module declares an output named hostnames. How do you access the value of this output?

- **A.** production.hostnames
- **B.** module.production.hostnames **← CORRETTA**
- **C.** web_stack.hostnames
- **D.** module.web_stack.hostnames

**Risposta corretta:** B
> Esibito: q104_pre0.png

**Spiegazione:** Child module outputs are referenced as module.<module block name>.<output name>. The module block is named production, so the output is module.production.hostnames; web_stack is only part of the source path and is never used in references.

---

## Domanda 105
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which argument can you set on a module block to prevent Terraform from updating the module's configuration during an init or get operation?

- **A.** count
- **B.** lifecycle
- **C.** source
- **D.** version **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** The version argument of a module block constrains which release of a registry module Terraform installs, so pinning an exact version stops init and get from fetching a different one. count only creates multiple instances of the module, lifecycle is not supported on module blocks, and source only states where the module comes from.

---

## Domanda 106
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You are writing Terraform configuration that calls a child module. This child module declares an output value. How can you ensure that Terraform will print out this value when you run Terraform CLI commands such as terraform apply?

- **A.** Nothing. Terraform will automatically print out all output values from child modules.
- **B.** Nothing. Terraform cannot use output values from child modules.
- **C.** Declare a new output in your root configuration that references the module's output. **← CORRETTA**
- **D.** None of these will print the value.

**Risposta corretta:** C

**Spiegazione:** Terraform prints only the outputs of the root module. To show a child module output, declare an output in the root configuration whose value references it, such as value = module.example.instance_ip.

---

## Domanda 107
*Tipo: multiple_choice · fonte: text_layer*

All modules published on the official Terraform Registry are maintained and tested by HashiCorp.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Terraform Registry includes modules published by HashiCorp, verified partners, and the broader Terraform community. A module's presence in the registry does not mean HashiCorp maintains, tests, or supports it. Users should review the publisher, documentation, version history, and source repository when selecting a module.

---

## Domanda 108
*Tipo: multiple_choice · fonte: text_layer*

You root module contains a variable named num_servers. Which is the correct way to pass its value to a child module with an input named servers?

- **A.** servers = var(num_servers)
- **B.** servers = num_servers
- **C.** ${var.num_servers}
- **D.** servers = var.num_servers **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A child module receives values through arguments in its module block. The argument name must match the child module's input variable name, so servers is assigned the value of the root module variable using var.num_servers. Terraform uses the var. namespace to reference declared input variables; parentheses and interpolation syntax are not required for this direct expression.

---

## Domanda 109
*Tipo: multiple_choice · fonte: text_layer*

You're using a module block to reference a module from the Terraform Registry. How do you specify version 1.0.0 of the module?

- **A.** Add a version = "1.0.0" argument to the module block. **← CORRETTA**
- **B.** Nothing. Modules stored on the public Terraform module Registry always default to version 1.0.0.
- **C.** You cannot. Modules stored on the public Terraform Registry do not support versioning.
- **D.** Append a ?ref=v1.0.0 argument to the source path.

**Risposta corretta:** A

**Spiegazione:** A module block uses the version argument to constrain or select the module release obtained from the Terraform Registry. Setting version = "1.0.0" instructs Terraform to install that exact published module version during initialization. The ?ref= syntax applies to VCS source URLs, such as Git repositories, rather than Registry module source addresses.

---

## Domanda 110
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You need to destroy all of the resources in your Terraform workspace, except for aws_instance.ubuntu[1], which you want to keep. How can you tell Terraform to stop managing that specific resource without destroying it?

- **A.** Change the value of the count argument on the resource.
- **B.** Remove the resource block from your configuration.
- **C.** Run terraform state rm aws_instance.ubuntu[1]. **← CORRETTA**
- **D.** Use a moved block.

**Risposta corretta:** C

**Spiegazione:** terraform state rm removes aws_instance.ubuntu[1] from the state, so Terraform stops managing it without touching the real object, and the following terraform destroy leaves it alone. Changing count or removing the resource block would make Terraform destroy the instance, and a moved block changes an address rather than ending management. Since Terraform 1.7 a removed block with destroy = false achieves the same result in configuration.

---

## Domanda 111
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When you run terraform apply -refresh-only, which of the following is not consulted by Terraform to update the state file?

- **A.** Authentication credentials for the provider.
- **B.** Terraform configuration files defining the resources. **← CORRETTA**
- **C.** The actual infrastructure as reported by the provider API.
- **D.** The most recent state file.

**Risposta corretta:** B

**Spiegazione:** In refresh-only mode Terraform starts from the most recent state and asks the provider API, using the provider credentials, for the current attributes of each object, then updates the state with what it finds. The desired settings written in the resource blocks are not used to change anything, which is why refresh-only mode never proposes infrastructure changes.

---

## Domanda 112
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When declaring a variable, setting the sensitive argument to true will prevent the value from being stored in the state file.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** The sensitive argument only hides the value in plan and apply output and in other CLI displays. The value is still stored in plain text in the state file, which therefore has to be protected itself.

---

## Domanda 113
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which are benefits of migrating from a local state backend to a remote backend? (Choose two.)

- **A.** Eliminates the need to manage credentials when deploying infrastructure to multiple cloud providers.
- **B.** State locking that allows multiple team members to safely work on the same infrastructure. **← CORRETTA**
- **C.** Faster plans and apply execution because the state is cached locally on the cloud provider.
- **D.** Guarantees that configuration drift cannot occur for the managed infrastructure.
- **E.** The ability to enable server-side encryption at rest. **← CORRETTA**

**Risposta corretta:** B, E

**Spiegazione:** A remote backend keeps state in a shared location that supports locking, so team members can work on the same infrastructure without corrupting it, and many remote backends can encrypt the state at rest on the server side. Credentials still have to be managed, remote state does not make plans faster, and drift can still occur.

---

## Domanda 114
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

How can you configure a Terraform workspace to store its state remotely? (Choose two.)

- **A.** Add a cloud block inside the terraform block. **← CORRETTA**
- **B.** Set the TERRAFORM_BACKEND environment variable.
- **C.** Add a backend block inside the terraform block. **← CORRETTA**
- **D.** Set the TERRAFORM_CLOUD environment variable.

**Risposta corretta:** A, C

**Spiegazione:** State is stored remotely by adding to the terraform block either a backend block, such as backend "s3", or a cloud block that connects the configuration to HCP Terraform or Terraform Enterprise. There are no TERRAFORM_BACKEND or TERRAFORM_CLOUD environment variables for this.

---

## Domanda 115
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What does state locking accomplish?

- **A.** Sets a password on the state file.
- **B.** Blocks Terraform commands from modifying the state file. **← CORRETTA**
- **C.** Encrypts any credentials stored within the state file.
- **D.** Prevents accidental deletion of the state file.

**Risposta corretta:** B

**Spiegazione:** While an operation holds the lock, other Terraform commands that would write the state cannot acquire it, so they cannot modify the state at the same time. Locking does not set passwords, encrypt credentials or protect the file from deletion.

---

## Domanda 116
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Why is it considered important to treat your Terraform state file as sensitive?

- **A.** It contains personal information about the last user to update it.
- **B.** It can contain information such as resource passwords and keys. **← CORRETTA**
- **C.** It can be manually edited to change the deployed resources.
- **D.** It stores all environment variables from the machine that created it.

**Risposta corretta:** B

**Spiegazione:** The state file records every attribute of the managed resources, which can include passwords, keys and other secrets in plain text. Anyone who can read the state can read those values, so it has to be stored securely, with encryption and restricted access.

---

## Domanda 117
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Terraform stores the value of an output in its state file, even if the sensitive argument is set to true.

- **A.** True **← CORRETTA**
- **B.** False

**Risposta corretta:** A

**Spiegazione:** Outputs marked as sensitive are hidden in CLI output, but their values are still saved in the state file, where they can be read for example with terraform output -json.

---

## Domanda 118
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You provisioned virtual machines (VMs) on Google Cloud Platform using the `gcloud` command line tool. What must be done to manage these VMs using Terraform instead? (Choose two.)

- **A.** Add an import block to the configuration. **← CORRETTA**
- **B.** Run terraform apply -refresh-only.
- **C.** Add a resource block for the existing VM. **← CORRETTA**
- **D.** Run terraform state pull.

**Risposta corretta:** A, C

**Spiegazione:** To bring existing VMs under Terraform management, the configuration needs a resource block for each VM and an import block that maps the VM's cloud ID to that resource address; the next apply adds the VMs to the state. terraform plan -generate-config-out can generate the resource blocks. A refresh-only apply or terraform state pull only work with resources already in state.

---

## Domanda 119
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which is a recommended way to share Terraform state across teams?

- **A.** Use a remote state backend. **← CORRETTA**
- **B.** Store terraform.tfstate state in HashiCorp Vault.
- **C.** No additional configuration is recommended.
- **D.** Store terraform.tfstate state in version control.

**Risposta corretta:** A

**Spiegazione:** A remote backend, such as HCP Terraform or a cloud storage backend, keeps the state in a shared location with access control and locking. Committing terraform.tfstate to version control exposes secrets and offers no locking, Vault is not a state backend, and local state cannot be shared safely.

---

## Domanda 120
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Once you configure a new Terraform backend with a terraform code block, which command should you use to migrate the state file?

- **A.** terraform init **← CORRETTA**
- **B.** terraform state rm
- **C.** terraform push
- **D.** terraform apply

**Risposta corretta:** A

**Spiegazione:** When the backend configuration changes, terraform init detects it and offers to copy the existing state to the new backend, and -migrate-state can request this explicitly. terraform state rm only removes resources from the state, terraform push no longer exists, and apply does not migrate state.

---

## Domanda 121
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You want to bring in an existing database under Terraform management. What information is required to create a new import block for the database? (Choose two.)

- **A.** The connection string that Terraform will use to connect and manage the database.
- **B.** The ID associated with the current database on the cloud provider. **← CORRETTA**
- **C.** The database platform and version that is the existing resource is running.
- **D.** The path to the .tf file that contains the database resource block.
- **E.** The destination resource address of the block that will manage the database. **← CORRETTA**

**Risposta corretta:** B, E

**Spiegazione:** An import block needs the ID of the existing object, in the format the provider uses for that resource type, and the address of the resource that will manage it, in the to argument. Terraform reads all the other attributes through the provider, so connection strings, platform versions and file paths are not needed.

---

## Domanda 122
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Terraform encrypts sensitive values stored in your state file.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Terraform writes state as plain JSON and does not encrypt sensitive values in it. Encryption at rest must come from where the state is stored, for example an encrypted S3 bucket or HCP Terraform.

---

## Domanda 123
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You've just finished refactoring part of your Terraform workspace's configuration to use a module to manage some of your resources. When you plan your changes, you notice that Terraform will destroy and recreate the affected resources. Doing so could cause unintended downtime in the application your workspace manages. What supported approach should you take to complete the refactor without destroying and recreating your resources?

- **A.** Add moved blocks to your configuration to let Terraform know the new resource addresses for the affected resources. **← CORRETTA**
- **B.** Open your cloud provider's console and rename the effected resources.
- **C.** Run the terraform console command to edit your workspace's state and update the resource names.
- **D.** Manually edit your terraform.tfstate file and update the resource names.

**Risposta corretta:** A

**Spiegazione:** A moved block records that a resource has a new address, for example from aws_instance.web to module.web.aws_instance.web, so during planning Terraform updates the state to the new address instead of destroying and recreating the object. Renaming resources in the cloud console does not change Terraform addresses, terraform console cannot edit state, and editing the state file by hand is error-prone and unsupported.

---

## Domanda 124
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What is the purpose of state locking in a remote backend?

- **A.** Ensures only one instance of Terraform can modify state at a time. **← CORRETTA**
- **B.** Creates a backup of the state file in a secure location.
- **C.** Encrypts the state in the remote backend.
- **D.** Requires every instance of Terraform uses the same provider version.

**Risposta corretta:** A

**Spiegazione:** State locking prevents concurrent operations: while one Terraform run holds the lock, others cannot write the state, so it cannot be corrupted by simultaneous changes. Backups, encryption and provider versions are handled by other features.

---

## Domanda 125
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What Terraform command always causes a state file to be updated with changes that might have been made outside of Terraform?

- **A.** terraform plan -refresh-only **← CORRETTA**
- **B.** terraform show -json
- **C.** terraform apply =lock=false
- **D.** terraform plan -target=state

**Risposta corretta:** A
> Nota: Nessuna opzione e' esatta alla lettera: terraform plan -refresh-only mostra come cambierebbe lo state ma non lo scrive, lo fa terraform apply -refresh-only (vedi la domanda 127). Tenuta la A, l'unica che usa la modalita' refresh-only.

**Spiegazione:** Refresh-only mode is how Terraform reconciles the state with changes made outside Terraform. Strictly speaking, terraform plan -refresh-only only shows how the state would change, and it is terraform apply -refresh-only that writes the update to the state file. Among the options, A is the only one in refresh-only mode: terraform show -json only prints state or a plan, =lock=false is not valid syntax, and -target=state is not a resource address.

---

## Domanda 126
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When should you use the force-unlock command?

- **A.** When you see a status message stating that you cannot acquire the lock.
- **B.** When apply has failed due to a state lock.
- **C.** When automatic unlocking has failed. **← CORRETTA**
- **D.** When you have a high priority change.

**Risposta corretta:** C

**Spiegazione:** terraform force-unlock removes a lock that Terraform failed to release automatically, for example after a crash or a lost connection. It should be used only when you are sure no other operation is holding the lock: a message that the lock cannot be acquired usually means another run is still in progress.

---

## Domanda 127
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

The -refresh-only parameter will update your state file when used with terraform plan.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** terraform plan -refresh-only shows the differences between the state and the real infrastructure but does not write them; it is terraform apply -refresh-only that updates the state file, after approval.

---

## Domanda 128
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You corrected a typo in a resource name, changing it from aws_s3_bucket.photoes to aws_s3_bucket.photos. You want to update the Terraform state so that the existing resource is recognized under the new name, without destroying and recreating it. Which configuration should you use?

- **A.** Remove the old resource from your configuration and re-import it.
- **B.** Run terraform apply -refresh-only.
- **C.** Do nothing - Terraform will automatically update the state.
- **D.** Add a moved block to your configuration. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A moved block with from = aws_s3_bucket.photoes and to = aws_s3_bucket.photos tells Terraform that the existing object now has a new address, so the plan updates the state instead of destroying and recreating the bucket. Without it Terraform would plan to destroy the old address and create the new one; re-importing works but takes more steps, and refresh-only mode does not rename resources.

---

## Domanda 129
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What feature stops multiple users from operating on the Terraform state at the same time?

- **A.** Remote state storage
- **B.** Version control
- **C.** State locking **← CORRETTA**
- **D.** Provider constraints

**Risposta corretta:** C

**Spiegazione:** State locking lets only one operation at a time write the state: while a run holds the lock, other users' runs have to wait or fail. Remote storage makes the state shared but does not by itself prevent concurrent writes, while version control and provider constraints are unrelated.

---

## Domanda 130
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What does the import block do?

- **A.** Migrate resources from one Terraform state file to another.
- **B.** Install a module.
- **C.** Combine Terraform state files.
- **D.** Import existing resources into state. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** An import block, with the resource address in to and the object's ID in id, brings an existing infrastructure object under Terraform management by importing it into the state during the next plan and apply. It does not move resources between state files or combine states, and modules are installed by terraform init.

---

## Domanda 131
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You have successfully deployed an application that includes a resource with a public IP address. Due to a configuration oversight, no outputs were defined. Using the Terraform CLI, how can you find the IP address of the resource that was deployed with minimum disruption to the application?

- **A.** Run terraform destroy then terraform apply and look for the IP address in stdout.
- **B.** Run terraform state list to find the name of the resource, then terraform state show to find the attributes including public IP address. **← CORRETTA**
- **C.** In a new folder, use the terraform_remote_state data source to load in the state file, then write an output for each resource that you find the state file.
- **D.** Run terraform output ip_address to view the result.

**Risposta corretta:** B

**Spiegazione:** terraform state list prints the address of every resource in the state, and terraform state show <address> prints all its attributes, including the public IP, without touching the infrastructure. Destroying and recreating would cause disruption, terraform output only shows declared outputs, and terraform_remote_state also exposes only the outputs of a state.

---

## Domanda 132
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

It is _________ to change the Terraform backend from the default local backend to a different one after performing your first terraform apply.

- **A.** discouraged
- **B.** mandatory
- **C.** impossible
- **D.** optional **← CORRETTA**

**Risposta corretta:** D
> Nota: Risposta corretta a mano da A (discouraged) a D (optional): la documentazione dice che la configurazione del backend si puo' cambiare in qualsiasi momento, e terraform init offre di migrare lo state esistente nel nuovo backend.

**Spiegazione:** Terraform supports changing the backend at any time, including after the first apply: when the backend configuration changes, terraform init detects it and offers to migrate the existing state to the new backend. Moving from local state to a remote backend is common as a project grows, so it is neither mandatory nor impossible, and the documentation does not discourage it.

---

## Domanda 133
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which is a benefit of the Terraform state file?

- **A.** A state file can schedule recurring infrastructure tasks.
- **B.** A state file is the desired state expressed by the Terraform code files.
- **C.** A state file is a source of truth for resources provisioned with Terraform. **← CORRETTA**
- **D.** A state file is a source of truth for resources provisioned with a public cloud console.

**Risposta corretta:** C

**Spiegazione:** The state file is Terraform's record of the real objects it manages, mapping each resource in the configuration to its remote object and attributes. The desired state is described by the configuration, not by the state, and state neither schedules tasks nor tracks resources created outside Terraform.

---

## Domanda 134
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which values does Terraform exclude from the state file? (Choose two.)

- **A.** Data sources
- **B.** Ephemeral resources **← CORRETTA**
- **C.** Resource attributes
- **D.** Write-only arguments **← CORRETTA**
- **E.** Sensitive outputs

**Risposta corretta:** B, D

**Spiegazione:** Ephemeral resources, introduced in Terraform 1.10, and write-only arguments, introduced in Terraform 1.11, are designed for secrets that must never be persisted, so Terraform does not store them in state or plan files. Data sources, resource attributes and outputs, sensitive ones included, are all recorded in the state.

---

## Domanda 135
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

__________ backends support state locking.

- **A.** Only local
- **B.** Some **← CORRETTA**
- **C.** All
- **D.** No

**Risposta corretta:** B

**Spiegazione:** State locking depends on the backend: many backends support it, such as local, s3, azurerm, gcs and HCP Terraform, but not every backend does.

---

## Domanda 136
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which backend does the Terraform CLI use by default?

- **A.** Remote
- **B.** Local **← CORRETTA**
- **C.** HCP Terraform
- **D.** The default backend for the cloud provider
- **E.** HTTP

**Risposta corretta:** B

**Spiegazione:** Without a backend or cloud block, Terraform uses the local backend, which stores the state in terraform.tfstate in the working directory. HCP Terraform, remote, HTTP or cloud storage backends are used only when configured explicitly.

---

## Domanda 137
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which command allows you to access all of the attributes and details of a resource managed by Terraform?

- **A.** terraform get 'provider_type.name'
- **B.** terraform state show 'provider_type.name' **← CORRETTA**
- **C.** terraform state list 'provider_type.name'
- **D.** terraform state list

**Risposta corretta:** B

**Spiegazione:** terraform state show <address> displays all the attributes of a single resource as recorded in the state. terraform state list only prints resource addresses, and terraform get downloads modules.

---

## Domanda 138
*Tipo: multiple_choice · fonte: text_layer*

When do you need to explicitly execute Terraform in refresh-only mode?

- **A.** Before every terraform plan.
- **B.** Before every terraform apply.
- **C.** Before every terraform import.
- **D.** None of the above. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** Refresh-only mode is needed only when the goal is to update Terraform state to reflect real infrastructure changes without modifying the infrastructure itself. Normal terraform plan and terraform apply already perform state refresh behavior as part of their standard workflow, so it is not required before either command. Terraform import also reads the imported resource into state directly, without requiring a prior refresh-only operation.

---

## Domanda 139
*Tipo: multiple_choice · fonte: text_layer*

You use a cloud provider account that is shared with other team members. You previously used Terraform to create a load balancer that listens on port 80. After some application changes, you updated the Terraform code to change the port to 443. You run terraform plan and see that the execution plan shows the port changing from 80 to 443 like you intended. You step away to grab some coffee. Before you get back to your desk, another team member manually changes the load balancer port to 443 through the cloud provider console. What will happen when you run terraform apply upon returning to your desk?

- **A.** Terraform will change the load balancer port to 80, and then change it back to 443.
- **B.** Terraform will recreate the load balancer.
- **C.** Terraform will not make any changes to the load balancer and will update the state file to reflect the manual change. **← CORRETTA**
- **D.** Terraform will fail with an error because the state file is no longer accurate.

**Risposta corretta:** C

**Spiegazione:** Terraform refreshes its view of remote infrastructure before applying the saved configuration changes. It detects that the load balancer port is already 443, which matches the current Terraform configuration, so there is no change left to perform. Terraform then updates its state to record the actual remote value. It does not revert the port to 80 because that value is no longer declared in the configuration.

---

## Domanda 140
*Tipo: multiple_choice · fonte: text_layer*

What does the default local Terraform backend store?

- **A.** State file **← CORRETTA**
- **B.** Terraform binary
- **C.** Provider plugins
- **D.** tfplan files

**Risposta corretta:** A

**Spiegazione:** The default local backend stores the Terraform state file on the local filesystem, typically in terraform.tfstate within the working directory. State records the real infrastructure resources Terraform manages and maps them to the configuration. The Terraform binary and provider plugins are installed separately, while plan files are generated only when explicitly saved.

---

## Domanda 141
*Tipo: multiple_choice · fonte: text_layer*

Using the terraform state rm command against a resource will destroy it.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** The terraform state rm command removes a resource from Terraform's state file only. It does not delete or destroy the actual infrastructure object managed by the provider. After removal, Terraform no longer tracks that object, so a later configuration change may attempt to create a replacement unless the resource is imported or removed from configuration.

---

## Domanda 142
*Tipo: multiple_choice · fonte: text_layer*

Which of these actions are forbidden when the Terraform state file is locked? (Choose three.)

- **A.** terraform apply **← CORRETTA**
- **B.** terraform fmt
- **C.** terraform validate
- **D.** terraform destroy **← CORRETTA**
- **E.** terraform state list
- **F.** terraform plan **← CORRETTA**

**Risposta corretta:** A, D, F

**Spiegazione:** A state lock prevents operations that could read and modify infrastructure based on a potentially changing state snapshot. Terraform apply and terraform destroy are blocked because they make infrastructure changes and update the state file. Terraform plan is also blocked because it needs a consistent state view to calculate an accurate execution plan. Commands such as terraform fmt, terraform validate, and terraform state list do not require the same locked state access.

---

## Domanda 143
*Tipo: multiple_choice · fonte: text_layer*

You decide to move a Terraform state file to Amazon S3 from another location. You write the code shown in the Exhibit space into a file called backend.tf. Which command will migrate your current state file to the new S3 backend?

- **A.** terraform refresh
- **B.** terraform push
- **C.** terraform state
- **D.** terraform init **← CORRETTA**

**Risposta corretta:** D
> Esibito: q143_pre0.png

**Spiegazione:** Terraform init initializes and configures the working directory, including any newly defined backend. When it detects that the backend has changed to S3, it prompts to migrate the existing state into the configured S3 bucket. Refresh only updates state data from real infrastructure, while state is a family of state-management subcommands rather than the backend migration workflow.

---

## Domanda 144
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

terraform destroy is the only way to remove infrastructure with Terraform.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Infrastructure can also be removed without terraform destroy: deleting a resource block from the configuration and running terraform apply destroys that object, and terraform apply -destroy is the same operation that terraform destroy performs.

---

## Domanda 145
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

A senior admin accidentally deleted some of your cloud instances. What will Terraform do when you run terraform apply?

- **A.** Stop and generate an error message about the missing instances.
- **B.** Rebuild only the instances that were deleted. **← CORRETTA**
- **C.** Build a completely brand new set of infrastructure.
- **D.** Tear down the entire workspace's infrastructure and rebuild it.

**Risposta corretta:** B

**Spiegazione:** During the refresh at the beginning of apply, Terraform notices that the deleted instances no longer exist and plans to create them again, because the configuration still declares them. Resources that still exist and match the configuration are left untouched.

---

## Domanda 146
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You have a Terraform configuration that defines a single virtual machine with no references to it. You've run terraform apply to create the resource, then removed the resource definition from your Terraform configuration file. What will happen when you run terraform apply in the working directory again?

- **A.** Terraform will error.
- **B.** Nothing will happen.
- **C.** Terraform will remove the virtual machine from the state file, but the resource will still exist.
- **D.** Terraform will destroy the virtual machine. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** The VM is still recorded in the state but no longer appears in the configuration, so Terraform plans to destroy it to make the infrastructure match the configuration. To stop managing it without destroying it, use terraform state rm or a removed block instead.

---

## Domanda 147
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

If you manually destroy resources within your infrastructure, what is the best practice for reflecting this change in Terraform?

- **A.** Run terraform import to reflect the changes in Terraform state.
- **B.** Manually update the state file to remove the destroyed resources.
- **C.** Remove the resource definition from your file and run terraform apply -refresh-only. **← CORRETTA**
- **D.** The change will happen automatically during the next terraform apply.

**Risposta corretta:** C

**Spiegazione:** If the destroyed resources should not come back, remove their blocks from the configuration and run terraform apply -refresh-only, which updates the state to drop the objects that no longer exist without proposing infrastructure changes. Editing the state by hand is error-prone, import is for adding existing objects, and a normal apply with the blocks still in place would recreate the resources.

---

## Domanda 148
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

When a check block's assertion fails, Terraform blocks the current operation from executing.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** Check blocks validate infrastructure without blocking: when an assertion fails, Terraform reports a warning and the operation continues. To stop an operation, use a variable validation block or a precondition or postcondition.

---

## Domanda 149
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You just scaled your VM infrastructure and realize you set the count variable to the wrong value. You correct the value and save your change. What must you do next to make your infrastructure match your configuration?

- **A.** Inspect your Terraform state because you want to change it.
- **B.** Run terraform apply and confirm the planned changes. **← CORRETTA**
- **C.** Inspect all Terraform outputs to make sure they are correct.
- **D.** Reinitialize because your configuration has changed.

**Risposta corretta:** B

**Spiegazione:** Changing count changes the desired configuration, so terraform apply plans the instances to add or remove and carries out the plan after confirmation. A change to a resource argument does not require reinitialization, and inspecting the state or the outputs does not change the infrastructure.

---

## Domanda 150
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What does terraform destroy do?

- **A.** Destroys all Terraform code files in the current directory, leaves the state file intact.
- **B.** Destroys all infrastructure in the Terraform state file. **← CORRETTA**
- **C.** Destroys the Terraform state file, leaves the infrastructure intact.
- **D.** Destroys all infrastructure in the configured Terraform provider.

**Risposta corretta:** B

**Spiegazione:** terraform destroy destroys every remote object tracked in the state of the current working directory and workspace. It does not touch the configuration files or delete the state file itself, and it leaves alone resources that Terraform does not manage, even in the same provider account.

---

## Domanda 151
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You have a simple Terraform configuration containing one VM (virtual machine) in a cloud provider. You run terraform apply and the VM is created successfully. You delete the VM using the cloud provider console, then run terraform apply again without changing any Terraform code. What happens next?

- **A.** Terraform will report an error.
- **B.** Terraform will recreate the VM. **← CORRETTA**
- **C.** Terraform will remove the VM from the state file.
- **D.** Terraform will not make any changes.

**Risposta corretta:** B

**Spiegazione:** At the beginning of apply Terraform refreshes the state, discovers that the VM no longer exists and plans to create it again, because the configuration still declares it. The state is then updated with the new VM.

---

## Domanda 152
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You have never used Terraform before and would like to test it out using a shared team account for a cloud provider. The shared team account already contains 15 VMs (virtual machines). You develop a new Terraform configuration containing one VM, perform terraform apply, and see that your VM was created successfully. How do you delete the newly-created VM with Terraform?

- **A.** Delete the Terraform state file and execute terraform apply.
- **B.** The Terraform state file only contains one new VM. Execute terraform destroy. **← CORRETTA**
- **C.** The Terraform state file contains all 16 VMs in the team account. Execute terraform destroy and select the newly-created VM.
- **D.** Delete the VM using the cloud provider console, and execute terraform apply to apply the changes to the Terraform state file.

**Risposta corretta:** B

**Spiegazione:** Terraform manages only the objects recorded in its own state, so the state contains just the new VM, not the 15 VMs created by other means, and terraform destroy deletes only that VM. Deleting the state file would make Terraform lose track of it, and deleting it in the console would leave a configuration that recreates it on the next apply.

---

## Domanda 153
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which parameters does the import block require? (Choose two.)

- **A.** backend
- **B.** The target resource address **← CORRETTA**
- **C.** provider
- **D.** The resource ID **← CORRETTA**

**Risposta corretta:** B, D

**Spiegazione:** An import block requires the to argument, the address of the resource that will manage the object, and the id argument, the identifier of the existing object in the provider. The provider argument is optional, needed only to select a non-default provider configuration, and backend is unrelated.

---

## Domanda 154
*Tipo: multiple_choice · fonte: text_layer*

You have set the TF_LOG_PATH environment variable for Terraform, and you would like to ensure the logs contain all debug-level messages and verbose process logs. Which action should you take?

- **A.** Set the TF_LOG environment variable to TRACE. **← CORRETTA**
- **B.** Update the Terraform GLI configuration file.
- **C.** Add a log argument to the terraform block.
- **D.** Run the terraform output command.

**Risposta corretta:** A

**Spiegazione:** Setting TF_LOG to TRACE enables Terraform's most detailed logging level, including debug messages and verbose internal process information. TF_LOG_PATH only specifies the file where Terraform writes logs; it does not control how much information is recorded. The TRACE level captures the comprehensive diagnostic output needed for detailed troubleshooting.

---

## Domanda 155
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Your team uses HCP Terraform to manage your infrastructure. You need to make a change to an infrastructure stack running in a public cloud. Which pattern follows Infrastructure as Code best practices for making a change?

- **A.** Make the change via the public cloud API endpoint.
- **B.** Use the public cloud console to make the change.
- **C.** Run the public cloud CLI tool to make the change.
- **D.** Submit a pull request and wait for an approved merge of the change. **← CORRETTA**
- **E.** Clone the repository containing your infrastructure code and then run the code.

**Risposta corretta:** D

**Spiegazione:** With Infrastructure as Code, changes go through the configuration stored in version control: a pull request lets the change be reviewed and, once merged, HCP Terraform's VCS integration runs the plan and apply. Changing the infrastructure through the console, CLI or API creates drift from the code, and running the code locally bypasses the team's workflow.

---

## Domanda 156
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of the following does HCP Terraform perform during a health assessment for a workspace? (Choose two.)

- **A.** Sentinel policy checks
- **B.** Resource drift detection **← CORRETTA**
- **C.** Estimate infrastructure cost
- **D.** Check block validation **← CORRETTA**
- **E.** Terraform test execution

**Risposta corretta:** B, D

**Spiegazione:** HCP Terraform health assessments perform drift detection, comparing the real infrastructure with the state, and continuous validation, which re-evaluates check blocks and other custom conditions. Sentinel policy checks, cost estimation and terraform test do not run as part of a health assessment.

---

## Domanda 157
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You manage two workspaces in your HCP Terraform organization. The first workspace manages your network configuration. The second workspace manages your compute resources, and retrieves values from the networking workspace. What HCP Terraform feature lets you run an apply operation on the compute workspace every time you update the networking workspace?

- **A.** Projects
- **B.** Policy
- **C.** Run tasks
- **D.** Run triggers **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A run trigger links workspaces: configured on the compute workspace with the networking workspace as its source, it queues a run in the compute workspace every time an apply completes in the networking workspace. Projects organize workspaces, policies enforce rules and run tasks call external services during a run.

---

## Domanda 158
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You can configure multiple cloud blocks in your Terraform configuration to connect your workspace to both HCP Terraform and your Terraform Enterprise instance.

- **A.** True
- **B.** False **← CORRETTA**

**Risposta corretta:** B

**Spiegazione:** A configuration can contain only one cloud block, which connects it to a single HCP Terraform organization or Terraform Enterprise instance, and a configuration with a cloud block cannot also declare a backend.

---

## Domanda 159
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which HCP Terraform feature is recommended when you want to use the same cloud provider credentials across multiple workspaces?

- **A.** Variable sets **← CORRETTA**
- **B.** Version Control System (VCS) integration
- **C.** The terraform_remote_state data source

**Risposta corretta:** A

**Spiegazione:** Variable sets group variables, such as provider credentials, and apply them to several workspaces or projects, so the credentials are defined and rotated in one place. VCS integration triggers runs from repositories, and terraform_remote_state reads outputs from another state.

---

## Domanda 160
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You are responsible for a set of infrastructure which is managed by two workspaces: example-network and example-compute. The example-compute workspace uses data from output values configured in the example-network workspace, and must be deployed afterward. Currently, this is a manual process: An operator deploys changes to the example-network workspace. They manually copy the output values from the example-network workspace to input variables configured for the example-compute workspace. They deploy the example-compute workspace. Which HCP Terraform features can you use to automate this process? (Choose two.)

- **A.** A health check configured on the example-compute workspace to create a plan when HCP Terraform applies changes to the example-network workspace.
- **B.** A run trigger configured on the example-network workspace to automatically plan changes to the example-compute workspace after every apply.
- **C.** A health check configured on the example-network workspace to create a plan on the example-compute workspace when HCP Terraform applies changes to it.
- **D.** A run trigger configured on the example-compute workspace to automatically plan changes after HCP Terraform applies changes to the example-network workspace. **← CORRETTA**
- **E.** A tfe_outputs data source configured in the example-compute workspace to automatically load output values from the example-network workspace. **← CORRETTA**

**Risposta corretta:** D, E

**Spiegazione:** A run trigger is configured on the downstream workspace, example-compute, with example-network as its source, so every apply in example-network automatically queues a run in example-compute. A tfe_outputs data source in example-compute reads the outputs of example-network without copying them by hand. Health assessments detect drift and validate conditions; they do not start runs in other workspaces.

---

## Domanda 161
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Where does HashiCorp recommend you store API tokens and other secrets within your team's Terraform workspaces? (Choose three.)

- **A.** In a terraform.tfvars file, checked into your version control system.
- **B.** In an environment variable and referenced with TF_VAR_variablename. **← CORRETTA**
- **C.** In HashiCorp Vault. **← CORRETTA**
- **D.** In a plaintext document on a shared drive.
- **E.** In an HCP Terraform variable, with the sensitive option checked. **← CORRETTA**

**Risposta corretta:** B, C, E

**Spiegazione:** Secrets should never be stored in files committed to version control or in plain text documents. HashiCorp recommends supplying them through environment variables such as TF_VAR_name, keeping them in a secrets manager like HashiCorp Vault, or storing them as HCP Terraform variables marked as sensitive, which cannot be read back once saved.

---

## Domanda 162
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which of these statements about HCP Terraform workspaces is false?

- **A.** You can trigger plans and applies using version control system integrations.
- **B.** HCP Terraform workspaces offer role-based access controls.
- **C.** You must use the CLI to switch between workspaces. **← CORRETTA**
- **D.** HCP Terraform workspaces can securely store cloud credentials.

**Risposta corretta:** C

**Spiegazione:** HCP Terraform workspaces can be selected and run from the web UI and the API as well as from the CLI, so the CLI is not mandatory. Workspaces do support runs triggered by VCS integrations, role-based access through team permissions and secure storage of credentials as sensitive variables.

---

## Domanda 163
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

How does an HCP Terraform integration using the cloud block differ from remote backends, such as S3?

- **A.** Using the cloud block automatically encrypts state files at rest and in transit.
- **B.** Using the cloud block requires using Terraform Enterprise.
- **C.** The cloud block supports multiple backends simultaneously.
- **D.** Using the cloud block enables remote operations on infrastructure managed by HCP Terraform or Terraform Enterprise. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** The cloud block connects a configuration to HCP Terraform or Terraform Enterprise and enables remote operations: plans and applies run on HCP Terraform, which also stores the state, the variables and the run history. A backend such as S3 only stores the state while operations run locally. HCP Terraform does not require Terraform Enterprise, and a configuration has a single cloud block.

---

## Domanda 164
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

Which features do HCP Terraform workspaces provide that are not available in Terraform Community Edition? (Choose three.)

- **A.** Automatic detection of common security issues.
- **B.** Remote execution of Terraform operations. **← CORRETTA**
- **C.** Support for multiple cloud providers.
- **D.** Store your configuration in a Version Control System (VCS).
- **E.** State versions and run history. **← CORRETTA**
- **F.** Store Terraform and environment variables in variable sets. **← CORRETTA**

**Risposta corretta:** B, E, F

**Spiegazione:** HCP Terraform workspaces add remote execution of plans and applies, a history of runs and state versions, and variable sets shared across workspaces. Terraform Community Edition already supports multiple cloud providers and configurations stored in a VCS, and neither edition automatically detects security issues.

---

## Domanda 165
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

What HCP Terraform feature helps organize similar workspaces together and let you configure them as a group?

- **A.** Variable sets
- **B.** Change requests
- **C.** Projects **← CORRETTA**
- **D.** Policy sets

**Risposta corretta:** C

**Spiegazione:** Projects group related workspaces within an organization, so permissions, variable sets and policy sets can be assigned to all of them at once. Variable sets and policy sets share variables and policies with workspaces, but they do not organize workspaces.

---

## Domanda 166
*Tipo: multiple_choice · fonte: text_layer · spiegazione scritta a parte*

You are an administrator of your HCP Terraform organization. Recently, a member of your organization accidentally applied a change to a workspace that manages infrastructure owned by a different team. What HCP Terraform features can you use to help prevent similar accidents in the future?

- **A.** Create separate teams in HCP Terraform for each team in your organization, then assign project and/or workspace permissions to each team. **← CORRETTA**
- **B.** Configure your workspaces to use the VCS-driven workflow, then update permissions to each repository in your VCS.
- **C.** Enable two-factor authentication for your HCP organization, then limit access to only specific users within your organization.
- **D.** For each workspace in your organization, edit its settings, and then assign only those users that are authorized to plan and apply changes to the workspace.

**Risposta corretta:** A

**Spiegazione:** HCP Terraform access is managed through teams: creating a team for each group in the organization and granting project or workspace permissions only to the teams that own the infrastructure prevents members from applying changes to other teams' workspaces. Workspace permissions are granted to teams rather than individual users, and VCS permissions or two-factor authentication do not control who can apply in a workspace.

---

## Domanda 167
*Tipo: multiple_choice · fonte: text_layer*

Your risk management organization requires that new AWS S3 buckets must be private, and their contents must be encrypted at rest. How can HCP Terraform automatically and proactively enforce this security control?

- **A.** With an S3 module with proper settings for buckets.
- **B.** By auditing cloud storage buckets with a vulnerability scanning tool.
- **C.** By adding variables to each HCP Terraform workspace to ensure these settings are always enabled.
- **D.** With a Sentinel policy, which runs before every apply. **← CORRETTA**

**Risposta corretta:** D

**Spiegazione:** A Sentinel policy enforces required infrastructure rules during the HCP Terraform policy check stage, before an apply can create or modify resources. It can inspect the planned AWS S3 bucket configuration and deny runs unless bucket access is private and server-side encryption is enabled. A reusable module encourages secure defaults but does not prevent users from bypassing or misconfiguring it. Vulnerability scanning detects issues after resources exist rather than proactively blocking them.

---
