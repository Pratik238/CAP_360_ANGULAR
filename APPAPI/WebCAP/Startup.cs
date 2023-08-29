using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using WebCAP.Common;
using WebCAP.Concrete;
using WebCAP.Interface;
using WebCAP.Mappings;
using WebCAP.Models;

namespace WebCAP
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.Configure<StripeOptions>(options =>
            {
                options.PublishableKey = Environment.GetEnvironmentVariable("PublishableKey");
                options.SecretKey = Environment.GetEnvironmentVariable("SecretKey");
                //options.WebhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");
                // options.BasicPrice = Environment.GetEnvironmentVariable("BASIC_PRICE_ID");
                //options.ProPrice = Environment.GetEnvironmentVariable("PRO_PRICE_ID");
                options.Domain = Environment.GetEnvironmentVariable("DOMAIN");
                //options.PublishableKey = "pk_test_51IFGVwAU5WVl2sjcxEZWYlCDbKEFhXWllnVmCwWpNgqtMCoMIbxUyUdpyYHW6muvUoCw6PlBu1TVhPMCdmaqDj2e00vpSaRVs2";
                //options.SecretKey = "sk_test_51IFGVwAU5WVl2sjcL0th6BnIrDGdxASwnWEfVp0c2MLTvHGdKOLy37NjHyCvnC8y5Oci81o7RJMSRF10pcfbuWmh00NToT84hV";
                //options.WebhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");
                //options.BasicPrice = "prod_IrfLNajV2tdUjK";
                //options.ProPrice = "prod_IrfLNajV2tdUjK";
                //options.Domain = "http://localhost:4200";
            });
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            #region MyRegion
            var connection = Configuration.GetConnectionString("DatabaseConnection");
            services.AddDbContext<DatabaseContext>(options => options.UseSqlServer(connection, b => b.UseRowNumberForPaging()));
            var fileSettings = Configuration.GetSection("FileSettings");

            //services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<FileSettings>(i =>
            {

                i.UploadFilePath = Configuration.GetSection("FileSettings")["UploadFilePath"];

            });



            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });


            services.Configure<Settings>(Configuration.GetSection("AppSettings"));
            services.Configure<Settings>(i =>
            {

                i.ConnectionString = Configuration.GetConnectionString("DatabaseConnection");
            });

            services.AddSingleton<IConfiguration>(Configuration);

            services.AddTransient<IRole, RoleConcrete>();
            services.AddTransient<IMemberRegistration, MemberRegistrationConcrete>();
            services.AddTransient<IUsers, UsersConcrete>();
            services.AddTransient<IUsersInRoles, UsersInRolesConcrete>();
            services.AddTransient<ICommon, CommonConcrete>();
            services.AddTransient<IStudent, StudentConcrete>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddScoped<IUrlHelper>(implementationFactory =>
            {
                var actionContext = implementationFactory.GetService<IActionContextAccessor>().ActionContext;
                return new UrlHelper(actionContext);
            });
            #endregion


            // Start Registering and Initializing AutoMapper

            Mapper.Initialize(cfg => cfg.AddProfile<MappingProfile>());
            services.AddAutoMapper();

            // End Registering and Initializing AutoMapper

            services.AddMvc(options => { options.Filters.Add(typeof(CustomExceptionFilterAttribute)); })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
            .AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
            });
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowCrosOrigin", corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin()
            //        // Apply CORS policy for any type of origin  
            //        .AllowAnyMethod()
            //        // Apply CORS policy for any type of http methods  
            //        .AllowAnyHeader()
            //        // Apply CORS policy for any headers  
            //        .AllowCredentials());
            //    // Apply CORS policy for all users  
            //});
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithExposedHeaders("X-Pagination"));
            });

            services.AddSwaggerDocumentation();
            #region OLD Working code for swagger configuration
            //// Register the Swagger generator, defining 1 or more Swagger documents
            //services.AddSwaggerGen(c =>
            //{
            //    c.SwaggerDoc("v1", new Info { Title = "WebCAP API", Version = "v1" });
            //}); 
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //Configure Swagger only for development purose not for production app.
                app.UseSwaggerDocumentation();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseAuthentication();


            app.UseCors("CorsPolicy");
            #region OLD Working code for Swagger Configuration

            //// Enable middleware to serve generated Swagger as a JSON endpoint.
            //app.UseSwagger();

            //// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            //// specifying the Swagger JSON endpoint.
            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebCAP API V1");
            //    //Reference document: https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-2.2&tabs=visual-studio
            //    //To serve the Swagger UI at the app's root (http://localhost:<port>/), set the RoutePrefix property to an empty string:
            //    c.RoutePrefix = string.Empty;
            //}); 
            #endregion

            app.UseMvcWithDefaultRoute();
            app.UseMvc(routes =>
            {

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }


    }
    /// <summary>
    /// Extension method or middleware for Swagger configuration in asp.net core for swagger version >2.0
    /// Reference From : https://ppolyzos.com/2017/10/30/add-jwt-bearer-authorization-to-swagger-and-asp-net-core/
    /// </summary>
    public static class SwaggerServiceExtensions
    {
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1.0", new Info { Title = "Main API v1.0", Version = "v1.0" });

                //Locate the XML file being generated by ASP.NET...
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.XML";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                {
                    //... and tell Swagger to use those XML comments.
                    c.IncludeXmlComments(xmlPath);
                }


                // Swagger 2.+ support
                var security = new Dictionary<string, IEnumerable<string>>
                {
                    {"Bearer", new string[] { }},
                };
                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
                //Must require for swagger version > 2.0
                c.AddSecurityRequirement(security);
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1.0/swagger.json", "Cap Web API v1.0");
                c.DocumentTitle = "Title Documentation";
                //Reference link : https://stackoverflow.com/questions/22008452/collapse-expand-swagger-response-model-class
                //Reference link : https://swagger.io/docs/open-source-tools/swagger-ui/usage/deep-linking/
                //  c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
                // c.DocExpansion(DocExpansion.Full);
                //    //Reference document: https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-2.2&tabs=visual-studio
                //    //To serve the Swagger UI at the app's root (http://localhost:<port>/), set the RoutePrefix property to an empty string:
                c.RoutePrefix = string.Empty;
            });

            return app;
        }
    }
}
