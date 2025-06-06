<!-- 
  <section id="projects">
    <div class="w-full space-y-12 py-12">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
              My Projects
            </div>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
              Check out my latest work
            </h2>
            <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I&apos;ve worked on a variety of projects, from simple websites to complex web
              applications. Here are a few of my favorites.
            </p>
          </div>
        </div>
      </BlurFade>
      <div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
        {#each DATA.projects as project, id}
          <BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.05}>
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              video={project.video}
              links={project.links}
            />
          </BlurFade>
        {/each}
      </div>
    </div>
  </section>

  <section id="hackathons">
    <div class="w-full space-y-12 py-12">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
              Hackathons
            </div>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">I like building things</h2>
            <p class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              During my time in university, I attended {DATA.hackathons.length}+ hackathons. People from around the country would come
              together and build incredible things in 2-3 days. It was eye-opening to see the endless possibilities brought to life by a group of motivated and passionate individuals.
            </p>
          </div>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <ul class="mb-4 ml-4 divide-y divide-dashed border-l">
          {#each DATA.hackathons as project}
            <BlurFade delay={BLUR_FADE_DELAY}>
              <HackathonCard {...project} />
            </BlurFade>
          {/each}
        </ul>
      </BlurFade>
    </div>
  </section> -->
